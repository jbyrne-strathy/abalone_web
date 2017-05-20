var SelectedMarbles = {
	marbles: [],
	circles: [],
	draw : function () {
		var drawMarble = function (index) {
			SelectedMarbles.circles[index].x = SelectedMarbles.marbles[index].getX();
			SelectedMarbles.circles[index].y = SelectedMarbles.marbles[index].getY();
			SelectedMarbles.circles[index].graphics
				.setStrokeStyle(10)
				.beginStroke(Constants.selectedMarbleColor)
				.drawCircle(0, 0, Constants.marbleRadius);
		}
		try {
			drawMarble(0);
			drawMarble(1);
			drawMarble(2);
		} catch (error) {
			// Ignore it.
		} finally {
			window.stage.update();
		}
	},
	addMarble: function (marble) {
		if (!SelectedMarbles.contains(marble)) {
			SelectedMarbles.marbles.push(marble);
			var outline = new createjs.Shape();
			SelectedMarbles.circles.push(outline);
			window.stage.addChild(outline);
			SelectedMarbles.draw();
		}
	},
	removeMarble: function (marble) {
		var i = SelectedMarbles.marbles.indexOf(marble);
		window.stage.removeChild(SelectedMarbles.circles[i]);
		SelectedMarbles.marbles.splice(i, 1);
		SelectedMarbles.circles.splice(i, 1);
		SelectedMarbles.draw();
	},
	clearMarbles: function () {
		try {
			window.stage.removeChild(SelectedMarbles.circles[0]);
			window.stage.removeChild(SelectedMarbles.circles[1]);
			window.stage.removeChild(SelectedMarbles.circles[2]);
		} catch (error) {
			// Ignore it.
		} finally {
			SelectedMarbles.marbles = [];
			SelectedMarbles.circles = [];
			SelectedMarbles.draw();
		}
	},
	getMarbles : function () {
		return SelectedMarbles.marbles;
	},
	contains : function (marble) {
		return SelectedMarbles.marbles.indexOf(marble) >= 0;
	},
	isEmpty : function () {
		return SelectedMarbles.marbles.length == 0;
	},
	size : function () {
		return SelectedMarbles.marbles.length;
	},
	get : function (index) {
		return SelectedMarbles.marbles[index];
	},
	move : function(xTransform, yTransform) {
		try {
			SelectedMarbles.marbles[0].move(xTransform, yTransform);
			SelectedMarbles.marbles[1].move(xTransform, yTransform);
			SelectedMarbles.marbles[2].move(xTransform, yTransform);
		} catch (error) {
			// Ignore it.
		} finally {
			SelectedMarbles.draw();
		}
	}
}
