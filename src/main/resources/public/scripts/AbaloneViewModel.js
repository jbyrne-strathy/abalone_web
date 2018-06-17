function AbaloneViewModel () {
    var self = this;

    /* NAVIGATION */
    this.visibleSection = ko.observable();

    this.goToLogin = function () {
        self.visibleSection(Constants.sections.login);
    };

    this.goToCreateAccount = function () {
        self.visibleSection(Constants.sections.createAccount);
    };

    this.goToLeaderboard = function () {
        self.visibleSection(Constants.sections.leaderboard);
    };

    this.goToLobby = function () {
        self.visibleSection(Constants.sections.lobby);
    };

    this.goToChallenge = function () {
        self.visibleSection(Constants.sections.challengeReceived);
    };

    this.goToWaiting = function () {
        self.visibleSection(Constants.sections.challengeSent);
    };

    this.leaveLobby = function () {
        Requests.leaveLobby();
    };

    /* LOGIN / CREATE ACCOUNT */
    this.loginError = ko.observable(false);
    this.invalidUsername = ko.observable(false);
    this.username = ko.observable();
    this.password = ko.observable();

    this.setup = function () {
        HumanPlayer.name = sessionStorage.name;
        self.goToLobby();
        Requests.joinLobby(self.updateLobby, self.handleError);
    };

    this.storeLoginToken = function (token) {
        sessionStorage.token = token;
        sessionStorage.name = self.username();
        self.username('');
        self.password('');
        self.setup();
    };

    this.login = function () {
        self.loginError(false);
        Requests.login(self.username(), self.password(),
            self.storeLoginToken, self.handleLoginError);
    };

    this.handleLoginError = function (error) {
        console.log("handleLoginError", JSON.stringify(error));
        self.loginError(true);
    };

    this.createAccount = function () {
        self.invalidUsername(false);
        Requests.createAccount(self.username(), self.password(),
            self.goToLogin, self.handleCreateAccountError);
    };

    this.handleCreateAccountError = function (error) {
        console.log("handleCreateAccountError", JSON.stringify(error));
        self.invalidUsername(true);
    };

    /* LOBBY */
    this.lobby = ko.observableArray();
    this.challenger = ko.observable();
    this.challenged = ko.observable();

    this.updateLobby = function (lobby) {
        var updatePlayers = function(players) {
            self.lobby.removeAll();
            for (i = 0; i < players.length; i++) {
                if (players[i].name === HumanPlayer.name) {
                    players.splice(i, 1);
                    break;
                }
            }
            self.lobby(players);
        }
        if (self.visibleSection() === Constants.sections.lobby) {
            updatePlayers(lobby.players);

            if (lobby.challenges) {
                for (i = 0; i < lobby.challenges.length; i++) {
                    var challenge = lobby.challenges[i];
                    if (challenge.challenged.name == HumanPlayer.name) {
                        self.challenger(challenge.challenger.name);
                        self.goToChallenge();
                        break;
                    } else if (challenge.challenger.name == HumanPlayer.name) {
                        self.challenged(challenge.challenged.name)
                        self.goToWaiting();
                        break;
                    }
                }
            }
        } else if (self.visibleSection() === Constants.sections.challengeSent
                || self.visibleSection() === Constants.sections.challengeReceived) {
            if (!lobby.challenges.find(function (challenge) {
                return challenge.challenger.name === HumanPlayer.name
                        || challenge.challenged.name === HumanPlayer.name
            })) {
                updatePlayers(lobby.players);
                self.goToLobby();
            }
        }
        Requests.getLobbyUpdate(self.updateLobby, self.handleError);
    };

    this.handleChallengeResponse = function (response) {
        // No action required.
        console.log("Challenge response: ", response);
    };

    this.sendChallenge = function (player) {
        Requests.sendChallenge(player.name, self.handleChallengeResponse, self.handleError);
    };

    this.acceptChallenge = function () {
        //TODO start the game
        Requests.answerChallenge(true, null, self.handleError);
    };

    this.rejectChallenge = function () {
        Requests.answerChallenge(false, self.goToLobby, self.handleError);
    };

    /* INIT */
    this.handleError = function (error) {
        // TODO Something better
        console.log("handleError", JSON.stringify(error));
        self.goToLogin();
    };

    this.init = ko.computed(function () {
        if(sessionStorage.token) {
            self.setup();
        } else {
            self.goToLogin();
        }
    });
}
ko.applyBindings(new AbaloneViewModel());