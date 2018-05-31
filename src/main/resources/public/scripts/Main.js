/*##### GAME FUNCTIONS #####*/
var stage, isoScale;
function configureWindow () {
	var w = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth,
	h = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight, xScale = w / Constants.boardWidth, yScale = h / Constants.boardHeight;
	stage.scaleX = stage.scaleY = isoScale = Math.min(xScale, yScale);
	stage.canvas.height = h;
	stage.canvas.width = h * (Constants.boardWidth / Constants.boardHeight);
	stage.update();
}

function startGame (myNumber, opponentNumber, opponentName, aiPlayer) {
    hideAllDivs();
    $("#game").show();
    if (stage) {
	    stage.removeAllChildren();
    } else {
        stage = new createjs.Stage("demoCanvas");
    }
	window.onresize = configureWindow;
	configureWindow();

    var opponent = aiPlayer || RemotePlayer;
    opponent.opponent = HumanPlayer;
    opponent.name = opponentName;
    opponent.playerNumber = opponentNumber;

    HumanPlayer.opponent = opponent;
    HumanPlayer.name = $("#me")[0].content;
    HumanPlayer.playerNumber = myNumber;

    GameState.create(null);
    Board.create(HumanPlayer, opponent);
    MouseListener.finished = false;
	stage.update();
}

function startAiGame() {
    startGame(1, 2, "Computer", AIPlayer);
}

function endGame() {
    MouseListener.finished = true;
    alert("Game over. Player " + GameState.winner + " has won!");
    goToLobby();
}

/*##### LOGIN FUNCTIONS #####*/

function goToLogin () {
    hideAllDivs();
    $("#login").show();
}

function goToCreateAccount () {
    hideAllDivs();
    $("#createAccount").show();
}

function storeLoginToken (token) {
    sessionStorage.token = token;
    sessionStorage.name = $("#username").val();
    goToLobby();
}

function login () {
    Requests.login($("#username").val(), $("#password").val(), storeLoginToken, handleLoginError);
}

function handleLoginError(error) {
    console.log("handleLoginError", JSON.stringify(error));
    $("#loginError").show();
}

function createAccount () {
    Requests.createAccount($("#createUsername").val(), $("#createPassword").val(), goToLogin, handleCreateAccountError);
}

function handleCreateAccountError(error) {
    console.log("handleCreateAccountError", JSON.stringify(error));
    $("#invalidUsername").show();
}

/*##### LEADERBOARD FUNCTIONS #####*/

function goToLeaderboard () {
    hideAllDivs();
    Requests.getLeaderboard(updateLeaderboard, handleError);
    $("#leaderboard").show();
}

function updateLeaderboard (leaderboard) {
    if($("leaderboard").is(":visible")) {
        $("#leagueTable tbody")[0].remove("tr");
        $.each(leaderboard, function (i, player) {
            var row = "<tr><td>" + (i+1) + "</td><td>" + player.name + "</td><td>" + player.wins + "</td><td>" + player.losses + "</td><td>" + player.pointsFor + "</td><td>" + player.pointsAgainst + "</td></tr>";
            $("#leagueTable").append(row);
        });
        Requests.getLeaderboardUpdate(updateLeaderboard, handleError);
    }
}

/*##### LOBBY FUNCTIONS #####*/

function goToLobby () {
    hideAllDivs();
    Requests.joinLobby(updateLobby, handleError);
    HumanPlayer.name = sessionStorage.name;
    $("#myName").text(HumanPlayer.name);
    $("#lobby").show();
}

function goToChallenge (challenger) {
    hideAllDivs();
    $("#challenger").text(challenger);
    $("#challengeReceived").show();
}

function goToWaiting (challenged) {
    hideAllDivs();
    $("#challenged").text(challenged);
    $("#challengeSent").show();
}

function updateLobby (lobby) {
    if ($("#lobby").is(":visible")) {
        $("#waitingPlayers tbody tr").remove();

        $.each(lobby.players, function (i, player) {
            if (player.name != HumanPlayer.name) {
                var row = $("<tr></tr>");
                var td = $("<td>" + player.name + "</td>");
                row.attr("onclick", "sendChallenge('" + player.name + "', handleChallengeResponse, handleError)");
                row.append(td);
                $("#waitingPlayers").append(row);
            }
        });

        if (lobby.challenges != null) {
            $.each(lobby.challenges, function (i, challenge) {
                if (challenge.challenged.name == HumanPlayer.name) {
                    goToChallenge(challenge.challenger.name);
                    return false;
                } else if (challenge.challenger.name == HumanPlayer.name) {
                    goToWaiting(challenge.challenged.name);
                    return false;
                }
            });
        }

        Requests.getLobbyUpdate(updateLobby, handleError);
    } else if ($("#challengeSent").is(":visible")
            || $("#challengeReceived").is(":visible")) {
        if (!lobby.challenges.find(function (challenge) {
            return challenge.challenger.name == HumanPlayer.name
                    || challenge.challenged.name == HumanPlayer.name
        })) {
            goToLobby();
        }
    }
}

function handleChallengeResponse (response) {
    // No action required.
    console.log("Challenge response: ", response);
}

function sendChallenge (player) {
    Requests.sendChallenge(player, handleChallengeResponse, handleError);
}

function acceptChallenge () {
    //TODO start the game
    Requests.answerChallenge(true, null, handleError);
}

function rejectChallenge () {
    Requests.answerChallenge(false, goToLobby, handleError);
}

/*##### GENERAL FUNCTIONS #####*/

function hideAllDivs () {
    $("#lobby").hide();
    $("#leaderboard").hide();
    $("#game").hide();
    $("#login").hide();
    $("#createAccount").hide();
    $("#challengeSent").hide();
    $("#challengeReceived").hide();
}

function handleError (error) {
    // TODO Something better
    console.log("handleError", JSON.stringify(error));
    goToLogin();
}

function init (name) {
    if(sessionStorage.token) {
        goToLobby();
    } else {
        goToLogin();
    }
    window.addEventListener("beforeunload", function (e) {
        Requests.leaveLobby();
        return null;
    });
}
