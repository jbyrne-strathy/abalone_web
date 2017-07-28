var HumanPlayer = {
    playerNumber: 0,
    name: "Human",
    opponent: null,
    // Update GameState and post moves to opponent.
    makeMove: function(moves) {
        PlayerUtils.updateState(moves);
        HumanPlayer.opponent.update(moves);
    },
    update: function(moves, gameStateHash) {
        MouseListener.currentPlayer = HumanPlayer.playerNumber;
        MouseListener.isHuman = true;
        // TODO Validate GameState matches our GameState.
    }
}