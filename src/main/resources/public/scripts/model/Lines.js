var Lines = {
	lines: [],
	getLinesForSpace: function (space) {
		var reply = [];
		var checkLine = function (i) {
			if (Lines.lines[i].indexOf(space) > -1) {
                reply.push(Lines.lines[i]);
            }
		};
		checkLine(0); checkLine(1); checkLine(2); checkLine(3); checkLine(4); checkLine(5); checkLine(6); checkLine(7); checkLine(8); checkLine(9); checkLine(10); checkLine(11); checkLine(12); checkLine(13); checkLine(14); checkLine(15); checkLine(16); checkLine(17); checkLine(18); checkLine(19); checkLine(20); checkLine(21); checkLine(22); checkLine(23); checkLine(24); checkLine(25); checkLine(26);
        return reply;
	},
	getLineForSpaces: function (space1, space2) {
		var getLine = null;
		var checkLine = function (i) {
			if (Lines.lines[i].indexOf(space1) > -1 && Lines.lines[i].indexOf(space2) > -1) {
                return Lines.lines[i];
            } else {
				return false;
			}
		};
		return checkLine(0) || checkLine(1) || checkLine(2) || checkLine(3) || checkLine(4) || checkLine(5) || checkLine(6) || checkLine(7) || checkLine(8) || checkLine(9) || checkLine(10) || checkLine(11) || checkLine(12) || checkLine(13) || checkLine(14) || checkLine(15) || checkLine(16) || checkLine(17) || checkLine(18) || checkLine(19) || checkLine(20) || checkLine(21) || checkLine(22) || checkLine(23) || checkLine(24) || checkLine(25) || checkLine(26);
	},
	getNeighbourSpaces: function (space) { // Can take either a marble or space.
		var neighbours = [];
		if (space.getSpace && typeof space.getSpace == "function") {
		    space = space.getSpace();
		}
		var checkLine = function (line) {
			var index = line.indexOf(space);
            if (index > 0) {
                neighbours.push(line[(index - 1)]);
            }
            if (index < line.length-1) {
                neighbours.push(line[(index + 1)]);
            }
		}
        var onLines = Lines.getLinesForSpace(space);
		checkLine(onLines[0]);
		checkLine(onLines[1]);
		checkLine(onLines[2]);
        return neighbours;
	},
    create: function (spaces, offBoard) {
        var spaces = Board.spaces;
        var offBoard = Board.offBoard;

        // Horizontal rows.
        Lines.lines[0] = [offBoard.out7, spaces.a1, spaces.a2, spaces.a3, spaces.a4, spaces.a5, offBoard.out8];
        Lines.lines[1] = [offBoard.out9, spaces.b1, spaces.b2, spaces.b3, spaces.b4, spaces.b5, spaces.b6, offBoard.out10];
        Lines.lines[2] = [offBoard.out11, spaces.c1, spaces.c2, spaces.c3, spaces.c4, spaces.c5, spaces.c6, spaces.c7, offBoard.out12];
        Lines.lines[3] = [offBoard.out13, spaces.d1, spaces.d2, spaces.d3, spaces.d4, spaces.d5, spaces.d6, spaces.d7, spaces.d8, offBoard.out14];
        Lines.lines[4] = [offBoard.out15, spaces.e1, spaces.e2, spaces.e3, spaces.e4, spaces.e5, spaces.e6, spaces.e7, spaces.e8, spaces.e9, offBoard.out16];
        Lines.lines[5] = [offBoard.out17, spaces.f1, spaces.f2, spaces.f3, spaces.f4, spaces.f5, spaces.f6, spaces.f7, spaces.f8, offBoard.out18];
        Lines.lines[6] = [offBoard.out19, spaces.g1, spaces.g2, spaces.g3, spaces.g4, spaces.g5, spaces.g6, spaces.g7, offBoard.out20];
        Lines.lines[7] = [offBoard.out21, spaces.h1, spaces.h2, spaces.h3, spaces.h4, spaces.h5, spaces.h6, offBoard.out22];
        Lines.lines[8] = [offBoard.out23, spaces.i1, spaces.i2, spaces.i3, spaces.i4, spaces.i5, offBoard.out24];

        // Diagonal from top-left
        Lines.lines[9] = [offBoard.out13, spaces.e1, spaces.f1, spaces.g1, spaces.h1, spaces.i1, offBoard.out26];
        Lines.lines[10] = [offBoard.out11, spaces.d1, spaces.e2, spaces.f2, spaces.g2, spaces.h2, spaces.i2, offBoard.out27];
        Lines.lines[11] = [offBoard.out9, spaces.c1, spaces.d2, spaces.e3, spaces.f3, spaces.g3, spaces.h3, spaces.i3, offBoard.out28];
        Lines.lines[12] = [offBoard.out7, spaces.b1, spaces.c2, spaces.d3, spaces.e4, spaces.f4, spaces.g4, spaces.h4, spaces.i4, offBoard.out29];
        Lines.lines[13] = [offBoard.out1, spaces.a1, spaces.b2, spaces.c3, spaces.d4, spaces.e5, spaces.f5, spaces.g5, spaces.h5, spaces.i5, offBoard.out30];
        Lines.lines[14] = [offBoard.out2, spaces.a2, spaces.b3, spaces.c4, spaces.d5, spaces.e6, spaces.f6, spaces.g6, spaces.h6, offBoard.out24];
        Lines.lines[15] = [offBoard.out3, spaces.a3, spaces.b4, spaces.c5, spaces.d6, spaces.e7, spaces.f7, spaces.g7, offBoard.out22];
        Lines.lines[16] = [offBoard.out4, spaces.a4, spaces.b5, spaces.c6, spaces.d7, spaces.e8, spaces.f8, offBoard.out20];
        Lines.lines[17] = [offBoard.out5, spaces.a5, spaces.b6, spaces.c7, spaces.d8, spaces.e9, offBoard.out18];

        // Diagonal from top-right
        Lines.lines[18] = [offBoard.out14, spaces.e9, spaces.f8, spaces.g7, spaces.h6, spaces.i5, offBoard.out29];
        Lines.lines[19] = [offBoard.out12, spaces.d8, spaces.e8, spaces.f7, spaces.g6, spaces.h5, spaces.i4, offBoard.out28];
        Lines.lines[20] = [offBoard.out10, spaces.c7, spaces.d7, spaces.e7, spaces.f6, spaces.g5, spaces.h4, spaces.i3, offBoard.out27];
        Lines.lines[21] = [offBoard.out8, spaces.b6, spaces.c6, spaces.d6, spaces.e6, spaces.f5, spaces.g4, spaces.h3, spaces.i2, offBoard.out26];
        Lines.lines[22] = [offBoard.out6, spaces.a5, spaces.b5, spaces.c5, spaces.d5, spaces.e5, spaces.f4, spaces.g3, spaces.h2, spaces.i1, offBoard.out25];
        Lines.lines[23] = [offBoard.out5, spaces.a4, spaces.b4, spaces.c4, spaces.d4, spaces.e4, spaces.f3, spaces.g2, spaces.h1, offBoard.out23];
        Lines.lines[24] = [offBoard.out4, spaces.a3, spaces.b3, spaces.c3, spaces.d3, spaces.e3, spaces.f2, spaces.g1, offBoard.out21];
        Lines.lines[25] = [offBoard.out3, spaces.a2, spaces.b2, spaces.c2, spaces.d2, spaces.e2, spaces.f1, offBoard.out19];
        Lines.lines[26] = [offBoard.out4, spaces.a1, spaces.b1, spaces.c1, spaces.d1, spaces.e1, offBoard.out17];
    }
};
