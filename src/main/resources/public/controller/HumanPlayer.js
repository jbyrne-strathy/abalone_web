var HumanPlayer = {
    isHuman: true,
    playerNumber: 0,
    name: "Human",
    opponent: null,
    // Update GameState and post moves to opponent.
    makeMove: function(moves) {
        var marbles = [];
        // Clear the spaces previously occupied by each marble.
        moves.forEach( function (move) {
            marbles.push( GameState.getMarbleAt(move.from) );
            GameState.removeMarble(move.from);
        } );
        // Now set the moved marbles to their new spaces.
        moves.forEach( function (move) {
            if(move.to.length >= 4){
                // When marble pushed off, increment the other player's score and strength.
                var pushedOutPlayer = marbles.shift();
                if(pushedOutPlayer == 1) {
                    GameState.player2Score++;
                    Board.player2Score.Text = GameState.player2Score.toString();
                } else if(pushedOutPlayer == 2) {
                    GameState.player1Score++;
                    Board.player1Score.Text = GameState.player1Score.toString();
                }
            } else {
                // Put marble in its new space.
                var movedPlayer = marbles.shift();
                GameState.setMarble(move.to, movedPlayer);
            }
        } );
        if(GameState.currentPlayer == 1){
            GameState.currentPlayer = 2;
        } else if(GameState.currentPlayer == 2){
            GameState.currentPlayer = 1;
        }
        if(GameState.player1Score == 6){
            GameState.setWinner(1);
        } else if(GameState.player2Score == 6){
            GameState.setWinner(2);
        }
        HumanPlayer.opponent.update(moves);
    },
    update: function(moves, gameStateHash) {
        BoardListener.currentPlayer = HumanPlayer.playerNumber;
        BoardListener.isHuman = true;
        // TODO Validate GameState matches our GameState.
    }
}