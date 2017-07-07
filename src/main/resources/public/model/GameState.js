var GameState = {
    spaces: {},
    winner: 0,
    currentPlayer: 1,
    player1Score: 0,
    player2Score: 0,
    create: function (loadedState) {
        if (loadedState) {
            GameState.spaces = loadedState.spaces;
            GameState.winner = loadedState.winner;
            GameState.currentPlayer = loadedState.currentPlayer;
            GameState.player1Score = loadedState.player1Score;
            GameState.player2Score = loadedState.player2Score;
        } else {
            GameState.spaces = Constants.defaultLayout;
            GameState.winner = 0;
            GameState.currentPlayer = 1;
            GameState.player1Score = 0;
            GameState.player2Score = 0;
        }
    },
    getMarbleAt: function (space) {
        return GameState.spaces[space];
    },
    removeMarble: function (space) {
        GameState.spaces[space] = 0;
    },
    setMarble: function (space, player) {
        GameState.spaces[space] = player;
    }
}