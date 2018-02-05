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

function updateLobby(lobby) {
    if ($("#lobby").is(":visible")) {
        $("#waitingPlayers tbody tr").remove();
        $.each(lobby, function (i, player) {
            if (player.name != HumanPlayer.name) {
                var row = "<tr><td>" + player.name + "</td></tr>";
                $("#waitingPlayers").append(row);
            }
        });
        Requests.getLobbyUpdate(updateLobby, handleError); /*Ready to test!*/
    }
}

/*##### GENERAL FUNCTIONS #####*/

function hideAllDivs () {
    $("#lobby").hide();
    $("#leaderboard").hide();
    $("#game").hide();
    $("#login").hide();
    $("#createAccount").hide();
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
