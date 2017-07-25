function Marble (space, player) {
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

Marble.prototype.getX = function () {
    return this.circle.x;
}

Marble.prototype.getY = function () {
    return this.circle.y;
}

Marble.prototype.getPlayer = function () {
   return this.player;
}

Marble.prototype.getSpace = function () {
    return this.space;
}

Marble.prototype.setSpace = function (space) {
    this.space = space;
    this.setPos(space.getX(), space.getY());
}

Marble.prototype.unsetSpace = function () {
    this.space = null;
}

Marble.prototype.setPos = function (newX, newY) {
    /*console.log(newX + ", " + newY)*/
    this.circle.x = newX;
    this.circle.y = newY;
    window.stage.update();
}

Marble.prototype.move = function (xTransform, yTransform) {
    this.circle.x = this.space.getX() + xTransform;
    this.circle.y = this.space.getY() + yTransform;
    //console.log(this.circle.x + ", " + this.circle.y);
    window.stage.update();
}

Marble.prototype.remove = function () {
    if (this.getSpace().getMarble() === this) {
        this.getSpace().setMarble(null);
    }
    this.unsetSpace();
    window.stage.removeChild(this.circle);
    window.stage.update();
}


