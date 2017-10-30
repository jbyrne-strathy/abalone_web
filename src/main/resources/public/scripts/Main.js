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
    $("#lobby").hide();
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
    $("#game").hide();
    $("#lobby").show();
}

function updateLobby(lobby) {
    $("#waitingPlayers tbody")[0].remove("tr");
    $.each(lobby, function (i, player) {
        if (player.name != HumanPlayer.name) {
            var row = "<tr><td>" + player.name + "</td></tr>";
            $("#waitingPlayers").append(row);
        }
    });
    Requests.getLobbyUpdate(updateLobby, handleError); /*Ready to test!*/
}

function handleError(error) {
    console.error(error);
}

function init (name) {
    HumanPlayer.name = $("#me")[0].content;
    Requests.getLobby(updateLobby, handleError);
}
