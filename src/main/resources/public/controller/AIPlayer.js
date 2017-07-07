var AIPlayer = {
    isHuman: false,
    playerNumber: 0,
    name: "Hugh",
    opponent: null,
    gameState: null,
    makeMove: function (moves) {
        // TODO Choose next move to make.
        // TODO Animate move on board.
        // TODO Pass back control to opponent.
    },
    update: function (moves, gameStateHash) {
        BoardListener.currentPlayer = AIPlayer.playerNumber;
        BoardListener.isHuman = false;
        // TODO Validate GameState matches our GameState.
    }
}