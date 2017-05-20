class Space {
    constructor (id, x, y) {
        this.id = id;
        this.marble = null;
		this.circle = new createjs.Shape();
		this.circle.x = x;
		this.circle.y = y;
        if (!id.startsWith("out")) {
			this.circle.graphics
				.beginFill(Constants.backgroundColor)
				.drawCircle(0, 0, Constants.spaceRadius);
		} else {
			this.circle.graphics
				.beginFill(null)
				.drawCircle(0, 0, Constants.spaceRadius);
		}
		window.stage.addChild(this.circle);
        return this;
    }

	getX () {
		return this.circle.x;
	}

	getY () {
		return this.circle.y;
	}

    getId () {
        return this.id;
    }

    getCircle () {
        return this.circle;
    }

    getMarble () {
        return this.marble;
    }

    setMarble (marble) {
        this.marble = marble;
    }
}
