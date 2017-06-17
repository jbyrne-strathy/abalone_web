var stage;
var isoScale;
function configureWindow(){
	var w = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth;

	var h = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;
	var xScale = w / Constants.boardWidth;
	var yScale = h / Constants.boardHeight;
	stage.scaleX = stage.scaleY = isoScale = Math.min(xScale, yScale);
	stage.canvas.height = h;
	stage.canvas.width = h * (Constants.boardWidth / Constants.boardHeight);
	stage.update();
}

function init(){
	stage = new createjs.Stage("demoCanvas");

	window.onresize = configureWindow;
	configureWindow();

    BoardListener.create(null);
    Board.create(null);

	stage.update();
}
