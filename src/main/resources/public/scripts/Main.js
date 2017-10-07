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

function startGame (myNumber, opponentNumber, opponentName) {
    stage = new createjs.Stage("demoCanvas");

	window.onresize = configureWindow;
	configureWindow();

    HumanPlayer.opponent = Remoteplayer;
    HumanPlayer.name = $("#me")[0].content;
    HumanPlayer.playerNumber = myNumber;

    RemotePlayer.opponent = HumanPlayer;
    RemotePlayer.name = opponentName;
    RemotePlayer.playerNumber = opponentNumber;

    GameState.create(null);
    Board.create(HumanPlayer, AIPlayer);

	stage.update();
}

function startAiGame() {
    $("#lobby").hide();
    $("#game").show();

    stage = new createjs.Stage("demoCanvas");

    window.onresize = configureWindow;
    configureWindow();

    HumanPlayer.name = $("#me")[0].content;
    HumanPlayer.opponent = AIPlayer;
    HumanPlayer.playerNumber = 1;
    AIPlayer.opponent = HumanPlayer;
    AIPlayer.playerNumber = 2;

    GameState.create(null);
    Board.create(HumanPlayer, AIPlayer);

    stage.update();
}

function init (name) {
    HumanPlayer.name = $("#me").content;
}
