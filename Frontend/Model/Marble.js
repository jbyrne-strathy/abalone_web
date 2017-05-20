class Marble {
    constructor (space, player) {
        this.space = space;
        this.player = player;
		this.isSelected = false;
        this.color;
		this.lineColor;
        switch(player){
            case 1:
                this.color = Constants.player1Color;
				this.lineColor = Constants.player1Color;
                break;
            case 2:
                this.color = Constants.player2Color;
				this.lineColor = Constants.player2Color;
                break;
            default:
                throw "Invalid player number chosen";
        }
        this.circle = new createjs.Shape();
		this.circle.x = space.getX();
		this.circle.y = space.getY();
        this.circle.graphics
			.beginStroke(this.lineColor)
			.beginFill(this.color)
			.drawCircle(0, 0, Constants.marbleRadius);
		var self = this;
        this.circle.on("pressmove", function (event){
            BoardListener.dragMarble(self, event);
        });
		this.circle.on("pressup", function (event) {
			BoardListener.releaseMarble(self, event);
		});
		this.circle.on("mousedown", function (event) {
			BoardListener.pressMarble(self, event);
		});
        window.stage.addChild(this.circle);
        return this;
    }

	getX () {
		return this.circle.x;
	}

	getY () {
		return this.circle.y;
	}

    getPlayer () {
	   return this.player;
    }

	getSpace () {
		return this.space;
	}

    setSpace (space) {
        this.space = space;
        this.setPos(space.getX(), space.getY());
    }

	unsetSpace () {
		this.space = null;
	}

    setPos (newX, newY) {
		/*console.log(newX + ", " + newY)*/
        this.circle.x = newX;
		this.circle.y = newY;
		window.stage.update();
    }

    move (xTransform, yTransform) {
        this.circle.x = this.space.getX() + xTransform;
		this.circle.y = this.space.getY() + yTransform;
		//console.log(this.circle.x + ", " + this.circle.y);
		window.stage.update();
    }

	remove () {
		this.getSpace().setMarble(null);
		this.unsetSpace();
		window.stage.removeChild(this.circle);
		window.stage.update();
	}

}

