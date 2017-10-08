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
    stage = new createjs.Stage("demoCanvas");
	window.onresize = configureWindow;
	configureWindow();

    opponent = aiPlayer || RemotePlayer;
    opponent.opponent = HumanPlayer;
    opponent.name = opponentName;
    opponent.playerNumber = opponentNumber;

    HumanPlayer.opponent = opponent;
    HumanPlayer.name = $("#me")[0].content;
    HumanPlayer.playerNumber = myNumber;

    GameState.create(null);
    Board.create(HumanPlayer, opponent);

	stage.update();
}

function startAiGame() {
    startGame(1, 2, "Computer", AIPlayer);
}

function init (name) {
    HumanPlayer.name = $("#me").content;
}
