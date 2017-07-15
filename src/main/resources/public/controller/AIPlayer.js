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
        AIPlayer.chooseMove();
    },
    findAvailableMoves: function () {
        var moves = [];
        $.each(Lines.lines, function (index, line) {
            $.each(line, function (i, space) {
                if (space.isOffBoard()) return true; // Continue: OffBoard spaces not held in game state.
                if (GameState.getMarbleAt( space ) == GameState.currentPlayer) {
                    // Moves in positive direction
                    if (i > 2) {
                        moves = moves.concat( identifyInlineMoves(space, line[i+1], [ line[i-1], line[i-2] ]) );
                        if (i < line.length - 3) {
                            moves = moves.concat( identifyPushingMoves(space, [ line[i+1], line[i+2], line[i+3] ], [ line[i-1], line[i-2] ]) );
                        } else if (i == line.length - 3) {
                            moves = moves.concat( identifyPushingMoves(space, [ line[i+1], line[i+2] ], [ line[i-1], line[i-2] ]) );
                        }
                    } else if (i == 2) {
                        moves = moves.concat( identifyInlineMoves(space, line[i+1], [ line[i-1] ]) );
                        if (i <= line.length - 3) {
                            moves = moves.concat( identifyPushingMoves(space, [ line[i+1], line[i+2] ], [ line[i-1] ]) );
                        }
                    } else {
                        moves = moves.concat( identifyInlineMoves(space, line[i+1], []) );
                    }
                    // Moves in negative direction
                    if (i < line.length - 3) {
                        moves = moves.concat( identifyInlineMoves(space, line[i-1], [ line[i+1], line[i+2] ]) );
                        if (i > 2) {
                            moves = moves.concat( identifyPushingMoves(space, [ line[i-1], line[i-2], line[i-3] ], [ line[i+1], line[i+2] ]) );
                        } else if (i == 2) {
                            moves = moves.concat( identifyPushingMoves(space, [ line[i-1], line[i-2] ], [ line[i+1], line[i+2] ]) );
                        }
                    } else if (i == line.length - 3) {
                        moves = moves.concat( identifyInlineMoves(space, line[i-1], [ line[i+1] ]) );
                        if (i >= 2) {
                            moves = moves.concat( identifyPushingMoves(space, [ line[i-1], line[i-2] ], [ line[i+1] ]) );
                        }
                    } else {
                        moves = moves.concat( identifyInlineMoves(space, line[i-1], []) );
                    }
                }
            } );
        } );
        // Identify all possible side-step moves.
//        for(String[] line : iGameState.LINES) {
//            // Find all single-marble moves which will move off of this line.
//            List<JSONObject> offLines = new LinkedList<>();
//            for(int i = 1; i < line.length-1; i++) { // Check each space.  Never moving from an out space.
//                for (JSONObject move : singleMoves) { // Check each move.
//                    if (move.getString("from").equals(line[i])) { // A move can be made from this space
//                        if (!move.getString("to").equals(line[i-1]) && !move.getString("to").equals(line[i+1])) {
//                            offLines.add(move); // Move is to a different line.
//                        }
//                    }
//                }
//            }
//
//            // Identify all 2- and 3-marble side-step moves from the offLines list.
//            for(int i = 0; i < offLines.size(); i++){
//                String iFrom = offLines.get(i).getString("from");
//                String iTo = offLines.get(i).getString("to");
//                for(int j = i+1; j < offLines.size(); j++){
//                    String jFrom = offLines.get(j).getString("from");
//                    String jTo = offLines.get(j).getString("to");
//                    if(!iTo.equals(jTo) && areNeighbours(line, iFrom, jFrom)){
//                        if(getLineForSpaces(iTo, jTo) != null) {
//                            if(areNeighbours(getLineForSpaces(iTo, jTo), iTo, jTo)){
//                                JSONArray sideStep = new JSONArray();
//                                sideStep.put(offLines.get(i));
//                                sideStep.put(offLines.get(j));
//                                moves.add(sideStep);
//                                for(int k = j+1; k < offLines.size(); k++){
//                                    String kFrom = offLines.get(k).getString("from");
//                                    String kTo = offLines.get(k).getString("to");
//                                    if( !kTo.equals(jTo) && !kTo.equals(iTo) && !kFrom.equals(jFrom) && !kFrom.equals(iFrom)
//                                            && ( areNeighbours(line, iFrom, kFrom) || areNeighbours(line, jFrom, kFrom) ) ){
//                                        if( getLineForSpaces(iTo, kTo) != null && getLineForSpaces(jTo, kTo) != null ) {
//                                            if( areNeighbours(getLineForSpaces(iTo, kTo), iTo, kTo)
//                                                    || areNeighbours(getLineForSpaces(jTo, kTo), jTo, kTo)) {
//                                                sideStep = new JSONArray();
//                                                sideStep.put(offLines.get(i));
//                                                sideStep.put(offLines.get(j));
//                                                sideStep.put(offLines.get(k));
//                                                moves.add(sideStep);
//                                            }
//                                        }
//                                    }
//                                }
//                            }
//                        }
//                    }
//                }
//            }
//        }
        return moves;
    },
    identifyInlineMoves: function (space, nextSpace, neighbours) {
        var result: [];
        if ( !nextSpace.isOffBoard() && GameState.getMarbleAt(nextSpace) == 0 ) {
            var move1 = {"from": space.id, "to": nextSpace.id};
            var move2, move3;
            result.push(move1);
            try {
                if (GameState.getMarbleAt(neighbours[0]) == GameState.currentPlayer) {
                    move2 = {"from": neighbours[0].id, "to": space.id};
                    result.push([move1, move2]);
                    if (GameState.getMarbleAt(neighbours[1]) == GameState.currentPlayer) {
                        move3 = {"from": neighbours[1].id, "to": neighbours[0].id}
                        result.push([move1, move2, move3]);
                    }
                }
            } catch (lessThan2Neighbours) {
                console.log("IdentifyInlineMoves: " + lessThan2Neighbours.message);
                // Just continue. Not an actual problem.
            }
        }
        return result;
    },
    identifyPushingMoves: function (space, pushedSpaces, neighbours) {
        result = [];
        if ( GameState.getMarbleAt( pushedSpaces[0] ) == opponent.playerNumber ) {
            if ( GameState.getMarbleAt( pushedSpaces[1] ) == 0 ) { // Pushing a single marble.
                // 2 pushing 1.
                if ( GameState.getMarbleAt( neighbours[0] ) == GameState.currentPlayer ) {
                    var move1 = {"from": neighbours[0].id, "to": space.id};
                    var move2 = {"from": space.id, "to": pushedSpaces[0].id};
                    var move3 = {"from": pushedSpaces[0].id, "to": pushedSpaces[1].id};
                    result.push([move1, move2, move3]);
                    // 3 pushing 1.
                    if ( GameState.getMarbleAt( neighbours[1] ) == GameState.currentPlayer ) {
                        var move4 = {"from": line[i+2].id, "to": line[i+1].id};
                        result.push([move1, move2, move3, move4]);
                    }
                }
            } else if ( GameState.getMarbleAt( pushedSpaces[1]) == opponent.playerNumber
                        && GameState.getMarbleAt( pushedSpaces[2] ) == 0 ) { // Pushing two marbles.
                if ( GameState.getMarbleAt( neighbours[0] ) == GameState.currentPlayer
                    && GameState.getMarbleAt( neighbours[1] ) == GameState.currentPlayer) {
                    var move1 = {"from": neighbours[1].id, "to": neighbours[0].id};
                    var move2 = {"from": neighbours[0].id, "to": space.id};
                    var move3 = {"from": space.id, "to": pushedSpaces[0].id};
                    var move4 = {"from": pushedSpaces[0].id, "to": pushedSpaces[1].id};
                    var move5 = {"from": pushedSpaces[1].id, "to": pushedSpaces[2].id};
                    result.push([move1, move2, move3, move4, move5]);
                }
            }
        }
        return result;
    },
    identifySidestepMoves: function () {
        // TODO
    }
}