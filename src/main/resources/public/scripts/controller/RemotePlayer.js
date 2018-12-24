var RemotePlayer = {
    isHuman: false,
    playerNumber: 0,
    name: "",
    opponent: null,
    gameState: null,
    makeMove: function(moves) {
        // TODO Validate GameState matches our GameState.
        PlayerUtils.animateMove(moves);
        PlayerUtils.updateState(moves);
        RemotePlayer.opponent.update(moves);
    },
    update: function(moves) {
        MouseListener.currentPlayer = RemotePlayer.playerNumber;
        MouseListener.isMyTurn = false;
        // TODO Send opponent's moves to the server
        // $.post("game server url", moves, makeMove);
    }
}