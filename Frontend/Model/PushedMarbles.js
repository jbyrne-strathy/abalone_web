var PushedMarbles = {
	marbles: [],
	draw : function () {/* Pushed marbles aren't highlighted */},
	addMarble: function (marble) {
		if(!PushedMarbles.contains(marble)) {
			PushedMarbles.marbles.push(marble);
		}
	},
	removeMarble: function (marble) {
		var i = PushedMarbles.marbles.indexOf(marble);
		PushedMarbles.marbles.splice(i, 1);
	},
	clearMarbles: function () {
		PushedMarbles.marbles = [];
	},
	getMarbles : function () {
		return PushedMarbles.marbles;
	},
	contains : function (marble) {
		return PushedMarbles.marbles.indexOf(marble) >= 0;
	},
	isEmpty : function () {
		return PushedMarbles.marbles.length == 0;
	},
	size : function () {
		return PushedMarbles.marbles.length;
	},
	get : function (index) {
		return PushedMarbles.marbles[index];
	},
	move : function(xTransform, yTransform) {
		try {
			PushedMarbles.marbles[0].move(xTransform, yTransform);
			PushedMarbles.marbles[1].move(xTransform, yTransform);
			PushedMarbles.marbles[2].move(xTransform, yTransform);
		} catch (error) {
			// Ignore it.
		} finally {
			PushedMarbles.draw();
		}
	}
}
