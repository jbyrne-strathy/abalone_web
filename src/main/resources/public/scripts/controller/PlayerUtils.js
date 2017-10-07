var PlayerUtils = {
    animateMove: function (moves) {
        var movingMarbles = [];
        var from = [];
        var to = [];
        $.each(moves, function (i, marbleMove) {
            $.each(Board.spaces, function (i, space) {
                if (space.id == marbleMove.from) {
                    movingMarbles.push(space.getMarble());
                    from.push(space);
                    return false; // No need to continue searching spaces.
                }
            } );
        } );
        $.each(moves, function (i, marbleMove) {
            var spaces = {};
            if ( !Board.spaces[marbleMove.to].isOffBoard() ) {
                spaces = Board.spaces;
            } else {
                spaces = Board.offBoard;
            }
            $.each(spaces, function (i, space) {
                if (space.id == marbleMove.to) {
                    to.push(space);
                    return false; // No need to continue searching spaces.
                }
            } );
        } );
        if (to[0] === undefined) {
            alert("to[0] is undefined!"); // Just to catch an error in debugging. Remove this.
        }
        var xChange = (to[0].getX() - from[0].getX())/30;
        var yChange = (to[0].getY() - from[0].getY())/30;

        // Move the marbles
        var count = 0;
        var timer = window.setInterval(function() {
            if (count == 30) {
                $.each(movingMarbles, function (i, marble) {
                    marble.setPos( to[i].getX(), to[i].getY() );
                    if(marble.getSpace().getMarble() === marble) {
                        marble.getSpace().setMarble(null);
                    }
                    marble.setSpace(to[i]);
                    to[i].setMarble(marble);
                } );
                window.clearInterval(timer);
            } else {
                $.each(movingMarbles, function (i, marble) {
                    marble.animate(xChange, yChange);
                } );
                count++;
            }
        }, 30 );
    },
    updateState: function (moves) {
        // Update game state with move
        var marbles = [];
        // Clear the spaces previously occupied by each marble.
        $.each(moves, function (i, move) {
            marbles.push( GameState.spaces[move.from] );
            GameState.removeMarble(move.from);
        } );
        // Now set the moved marbles to their new spaces.
        $.each(moves, function (i, move) {
            if (Board.offBoard[move.to] !== undefined) {
                // When marble pushed off, increment the other player's score and strength.
                var pushedOutPlayer = marbles.shift();
                if(pushedOutPlayer == 1) {
                    GameState.player2Score++;
                    Board.player2Score.text = GameState.player2Score.toString();
                } else if(pushedOutPlayer == 2) {
                    GameState.player1Score++;
                    Board.player1Score.text = GameState.player1Score.toString();
                }
            } else {
                // Put marble in its new space.
                var movedPlayer = marbles.shift();
                GameState.setMarble(move.to, movedPlayer);
            }
        } );
        console.log(GameState.spaces);

        if(GameState.currentPlayer == 1){
            GameState.currentPlayer = 2;
        } else if(GameState.currentPlayer == 2){
            GameState.currentPlayer = 1;
        }
        if(GameState.player1Score == 6){
            GameState.winner = 1;
        } else if(GameState.player2Score == 6){
            GameState.winner = 2;
        }
    }
};