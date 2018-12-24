function Space(id, x, y) {
    this.id = id;
    this.marble = null;
    this.circle = new createjs.Shape();
    this.circle.x = x;
    this.circle.y = y;
    if (id.startsWith("out")) {
        this.circle.graphics
            .beginFill(null)
            .drawCircle(0, 0, Constants.spaceRadius);
    } else {
        this.circle.graphics
            .beginFill(Constants.backgroundColor)
            .drawCircle(0, 0, Constants.spaceRadius);
    }
    return this;
}

Space.prototype.getX = function () {
    return this.circle.x;
};

Space.prototype.getY = function () {
    return this.circle.y;
};

Space.prototype.getId = function () {
    return this.id;
};

Space.prototype.getCircle = function () {
    return this.circle;
};

Space.prototype.getMarble = function () {
    return this.marble;
};

Space.prototype.setMarble = function (marble) {
    this.marble = marble;
};

Space.prototype.isOffBoard = function () {
    return this.id.indexOf("out") != -1;
};
