var Board = {
	spaces:  {},
	offBoard: {},
	player1Score: null,
	player1Name: null,
	player2Score: null,
	player2Name: null,

	create: function(){
		// Draw the background.
        var background = new createjs.Shape();
        background.graphics.beginFill(Constants.backgroundColor);
        background.graphics.drawRect(0, 0, Constants.boardWidth, Constants.boardHeight);
        window.stage.addChild(background);

        // Draw the board shape.
        var board = new createjs.Shape();
        var yOffset = Constants.yOffset, boardSpacing = Constants.halfBoardSpacing;
        board.graphics.setStrokeStyle(10);
        board.graphics.beginFill(Constants.boardColor);
        board.graphics.moveTo(boardSpacing*5, 0)
        board.graphics.lineTo(boardSpacing*15, 0)
        board.graphics.lineTo(Constants.boardWidth, Constants.boardHeight/2)
        board.graphics.lineTo(boardSpacing*15, Constants.boardHeight)
        board.graphics.lineTo(boardSpacing*5, Constants.boardHeight)
        board.graphics.lineTo(0, Constants.boardHeight/2)
        board.graphics.lineTo(boardSpacing*5, 0);
        window.stage.addChild(board);

        // Draw the player names and scores.
        Board.player1Name = new createjs.Text(BoardListener.player1.name, Constants.textFont, Constants.textColor);
        Board.player1Name.x = Constants.fullBoardSpacing - (Board.player1Name.getBounds().width / 2);
        Board.player1Name.y = Constants.halfBoardSpacing;
        window.stage.addChild(Board.player1Name);

        Board.player2Name = new createjs.Text(BoardListener.player2.name, Constants.textFont, Constants.textColor);
        Board.player2Name.x = Constants.boardWidth - Constants.fullBoardSpacing  - (Board.player1Name.getBounds().width / 2);
        Board.player2Name.y = Constants.halfBoardSpacing;
        window.stage.addChild(Board.player2Name);

        Board.player1Score = new createjs.Text(GameState.player1Score.toString(), Constants.textFont, Constants.textColor);
        Board.player1Score.x = Constants.fullBoardSpacing;
        Board.player1Score.y = Constants.fullBoardSpacing;
        window.stage.addChild(Board.player1Score);

        Board.player2Score = new createjs.Text(GameState.player2Score.toString(), Constants.textFont, Constants.textColor);
        Board.player2Score.x = Constants.boardWidth - Constants.fullBoardSpacing;
        Board.player2Score.y = Constants.fullBoardSpacing;
        window.stage.addChild(Board.player2Score);

        // Draw the spaces.
        Board.spaces.a1 = new Space("a1", 6*boardSpacing, yOffset);
        Board.spaces.a2 = new Space("a2", 8*boardSpacing, yOffset);
        Board.spaces.a3 = new Space("a3", 10*boardSpacing, yOffset);
        Board.spaces.a4 = new Space("a4", 12*boardSpacing, yOffset);
        Board.spaces.a5 = new Space("a5", 14*boardSpacing, yOffset);
        Board.spaces.b1 = new Space("b1", 5*boardSpacing, 2*yOffset);
        Board.spaces.b2 = new Space("b2", 7*boardSpacing, 2*yOffset);
        Board.spaces.b3 = new Space("b3", 9*boardSpacing, 2*yOffset);
        Board.spaces.b4 = new Space("b4", 11*boardSpacing, 2*yOffset);
        Board.spaces.b5 = new Space("b5", 13*boardSpacing, 2*yOffset);
        Board.spaces.b6 = new Space("b6", 15*boardSpacing, 2*yOffset);
        Board.spaces.c1 = new Space("c1", 4*boardSpacing, 3*yOffset);
        Board.spaces.c2 = new Space("c2", 6*boardSpacing, 3*yOffset);
        Board.spaces.c3 = new Space("c3", 8*boardSpacing, 3*yOffset);
        Board.spaces.c4 = new Space("c4", 10*boardSpacing, 3*yOffset);
        Board.spaces.c5 = new Space("c5", 12*boardSpacing, 3*yOffset);
        Board.spaces.c6 = new Space("c6", 14*boardSpacing, 3*yOffset);
        Board.spaces.c7 = new Space("c7", 16*boardSpacing, 3*yOffset);
        Board.spaces.d1 = new Space("d1", 3*boardSpacing, 4*yOffset);
        Board.spaces.d2 = new Space("d2", 5*boardSpacing, 4*yOffset);
        Board.spaces.d3 = new Space("d3", 7*boardSpacing, 4*yOffset);
        Board.spaces.d4 = new Space("d4", 9*boardSpacing, 4*yOffset);
        Board.spaces.d5 = new Space("d5", 11*boardSpacing, 4*yOffset);
        Board.spaces.d6 = new Space("d6", 13*boardSpacing, 4*yOffset);
        Board.spaces.d7 = new Space("d7", 15*boardSpacing, 4*yOffset);
        Board.spaces.d8 = new Space("d8", 17*boardSpacing, 4*yOffset);
        Board.spaces.e1 = new Space("e1", 2*boardSpacing, 5*yOffset);
        Board.spaces.e2 = new Space("e2", 4*boardSpacing, 5*yOffset);
        Board.spaces.e3 = new Space("e3", 6*boardSpacing, 5*yOffset);
        Board.spaces.e4 = new Space("e4", 8*boardSpacing, 5*yOffset);
        Board.spaces.e5 = new Space("e5", 10*boardSpacing, 5*yOffset);
        Board.spaces.e6 = new Space("e6", 12*boardSpacing, 5*yOffset);
        Board.spaces.e7 = new Space("e7", 14*boardSpacing, 5*yOffset);
        Board.spaces.e8 = new Space("e8", 16*boardSpacing, 5*yOffset);
        Board.spaces.e9 = new Space("e9", 18*boardSpacing, 5*yOffset);
        Board.spaces.f1 = new Space("f1", 3*boardSpacing, 6*yOffset);
        Board.spaces.f2 = new Space("f2", 5*boardSpacing, 6*yOffset);
        Board.spaces.f3 = new Space("f3", 7*boardSpacing, 6*yOffset);
        Board.spaces.f4 = new Space("f4", 9*boardSpacing, 6*yOffset);
        Board.spaces.f5 = new Space("f5", 11*boardSpacing, 6*yOffset);
        Board.spaces.f6 = new Space("f6", 13*boardSpacing, 6*yOffset);
        Board.spaces.f7 = new Space("f7", 15*boardSpacing, 6*yOffset);
        Board.spaces.f8 = new Space("f8", 17*boardSpacing, 6*yOffset);
        Board.spaces.g1 = new Space("g1", 4*boardSpacing, 7*yOffset);
        Board.spaces.g2 = new Space("g2", 6*boardSpacing, 7*yOffset);
        Board.spaces.g3 = new Space("g3", 8*boardSpacing, 7*yOffset);
        Board.spaces.g4 = new Space("g4", 10*boardSpacing, 7*yOffset);
        Board.spaces.g5 = new Space("g5", 12*boardSpacing, 7*yOffset);
        Board.spaces.g6 = new Space("g6", 14*boardSpacing, 7*yOffset);
        Board.spaces.g7 = new Space("g7", 16*boardSpacing, 7*yOffset);
        Board.spaces.h1 = new Space("h1", 5*boardSpacing, 8*yOffset);
        Board.spaces.h2 = new Space("h2", 7*boardSpacing, 8*yOffset);
        Board.spaces.h3 = new Space("h3", 9*boardSpacing, 8*yOffset);
        Board.spaces.h4 = new Space("h4", 11*boardSpacing, 8*yOffset);
        Board.spaces.h5 = new Space("h5", 13*boardSpacing, 8*yOffset);
        Board.spaces.h6 = new Space("h6", 15*boardSpacing, 8*yOffset);
        Board.spaces.i1 = new Space("i1", 6*boardSpacing, 9*yOffset);
        Board.spaces.i2 = new Space("i2", 8*boardSpacing, 9*yOffset);
        Board.spaces.i3 = new Space("i3", 10*boardSpacing, 9*yOffset);
        Board.spaces.i4 = new Space("i4", 12*boardSpacing, 9*yOffset);
        Board.spaces.i5 = new Space("i5", 14*boardSpacing, 9*yOffset);

        // Add the offboard spaces (not drawn).
        Board.offBoard.out1 = new Space("out1", 5*boardSpacing, 0);
        Board.offBoard.out2 = new Space("out2", 7*boardSpacing, 0);
        Board.offBoard.out3 = new Space("out3", 9*boardSpacing, 0);
        Board.offBoard.out4 = new Space("out4", 11*boardSpacing, 0);
        Board.offBoard.out5 = new Space("out5", 13*boardSpacing, 0);
        Board.offBoard.out6 = new Space("out6", 15*boardSpacing, 0);
        Board.offBoard.out7 = new Space("out7", 4*boardSpacing, yOffset);
        Board.offBoard.out8 = new Space("out8", 16*boardSpacing, yOffset);
        Board.offBoard.out9 = new Space("out9", 3*boardSpacing, 2*yOffset);
        Board.offBoard.out10 = new Space("out10", 17*boardSpacing, 2*yOffset);
        Board.offBoard.out11 = new Space("out11", 2*boardSpacing, 3*yOffset);
        Board.offBoard.out12 = new Space("out12", 18*boardSpacing, 3*yOffset);
        Board.offBoard.out13 = new Space("out13", boardSpacing, 4*yOffset);
        Board.offBoard.out14 = new Space("out14", 19*boardSpacing, 4*yOffset);
        Board.offBoard.out15 = new Space("out15", 0, 5*yOffset);
        Board.offBoard.out16 = new Space("out16", 20*boardSpacing, 5*yOffset);
        Board.offBoard.out17 = new Space("out17", boardSpacing, 6*yOffset);
        Board.offBoard.out18 = new Space("out18", 19*boardSpacing, 6*yOffset);
        Board.offBoard.out19 = new Space("out19", 2*boardSpacing, 7*yOffset);
        Board.offBoard.out20 = new Space("out20", 18*boardSpacing, 7*yOffset);
        Board.offBoard.out21 = new Space("out21", 3*boardSpacing, 8*yOffset);
        Board.offBoard.out22 = new Space("out22", 17*boardSpacing, 8*yOffset);
        Board.offBoard.out23 = new Space("out23", 4*boardSpacing, 9*yOffset);
        Board.offBoard.out24 = new Space("out24", 16*boardSpacing, 9*yOffset);
        Board.offBoard.out25 = new Space("out25", 5*boardSpacing, 10*yOffset);
        Board.offBoard.out26 = new Space("out26", 7*boardSpacing, 10*yOffset);
        Board.offBoard.out27 = new Space("out27", 9*boardSpacing, 10*yOffset);
        Board.offBoard.out28 = new Space("out28", 11*boardSpacing, 10*yOffset);
        Board.offBoard.out29 = new Space("out29", 13*boardSpacing, 10*yOffset);
        Board.offBoard.out30 = new Space("out30", 15*boardSpacing, 10*yOffset);

        Lines.create(Board.spaces, Board.offBoard);

        // Add the marbles
		for (space in GameState.spaces) {
			var player = GameState.spaces[space];
            if(player < 0 || player > 2){
                throw "Invalid player number found in space " + space.getId() + ": " + player;
            }
            if(player != 0){
				var marble = new Marble(Board.spaces[space], player);
				Board.spaces[Board.spaces[space].getId()].setMarble(marble);
            }
        }
    }
}
