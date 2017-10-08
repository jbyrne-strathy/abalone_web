var AIPlayer = {
    playerNumber: 0,
    name: "",
    opponent: null,
    gameState: null,
    makeMove: function (moves) {
        PlayerUtils.animateMove(moves);
        PlayerUtils.updateState(moves);
        AIPlayer.opponent.update(moves);
    },
    update: function (moves, gameStateHash) {
        MouseListener.currentPlayer = AIPlayer.playerNumber;
        MouseListener.isHuman = false;
        var moves = AIPlayer.findAvailableMoves();
        var index = Math.floor( Math.random() * moves.length );
        var move = moves[index];
        if (move === undefined) {
            alert("Move is undefined!"); // Just to catch an error in debugging. Remove this.
        }
        AIPlayer.makeMove( move );
        //console.log("Moves: ", moves);
    },
    findAvailableMoves: function () {
        var moves = [];
        $.each(Lines.lines, function (index, line) {
            $.each(line, function (i, space) {
                if (space.isOffBoard()) return true; // Continue: OffBoard spaces not held in game state.
                if (GameState.getMarbleAt( space ) == GameState.currentPlayer) {
                    // Moves in positive direction
                    if (i > 2) {
                        moves = moves.concat( AIPlayer.identifyInlineMoves(space, line[i+1], [ line[i-1], line[i-2] ]) );
                        moves = moves.concat( AIPlayer.identifySidestepMoves(space, line[i+1]) );
                        if (i < line.length - 3) {
                            moves = moves.concat( AIPlayer.identifyPushingMoves(space, [ line[i+1], line[i+2], line[i+3] ], [ line[i-1], line[i-2] ]) );
                        } else if (i == line.length - 3) {
                            moves = moves.concat( AIPlayer.identifyPushingMoves(space, [ line[i+1], line[i+2] ], [ line[i-1], line[i-2] ]) );
                        }
                    } else if (i == 2) {
                        moves = moves.concat( AIPlayer.identifyInlineMoves(space, line[i+1], [ line[i-1] ]) );
                        moves = moves.concat( AIPlayer.identifySidestepMoves(space, line[i+1]) );
                        if (i <= line.length - 3) {
                            moves = moves.concat( AIPlayer.identifyPushingMoves(space, [ line[i+1], line[i+2] ], [ line[i-1] ]) );
                        }
                    } else {
                        moves = moves.concat( AIPlayer.identifyInlineMoves(space, line[i+1], []) );
                        moves = moves.concat( AIPlayer.identifySidestepMoves(space, line[i+1]) );
                    }
                    // Moves in negative direction
                    if (i < line.length - 3) {
                        moves = moves.concat( AIPlayer.identifyInlineMoves(space, line[i-1], [ line[i+1], line[i+2] ]) );
                        moves = moves.concat( AIPlayer.identifySidestepMoves(space, line[i-1]) );
                        if (i > 2) {
                            moves = moves.concat( AIPlayer.identifyPushingMoves(space, [ line[i-1], line[i-2], line[i-3] ], [ line[i+1], line[i+2] ]) );
                        } else if (i == 2) {
                            moves = moves.concat( AIPlayer.identifyPushingMoves(space, [ line[i-1], line[i-2] ], [ line[i+1], line[i+2] ]) );
                        }
                    } else if (i == line.length - 3) {
                        moves = moves.concat( AIPlayer.identifyInlineMoves(space, line[i-1], [ line[i+1] ]) );
                        moves = moves.concat( AIPlayer.identifySidestepMoves(space, line[i-1]) );
                        if (i >= 2) {
                            moves = moves.concat( AIPlayer.identifyPushingMoves(space, [ line[i-1], line[i-2] ], [ line[i+1] ]) );
                        }
                    } else {
                        moves = moves.concat( AIPlayer.identifyInlineMoves(space, line[i-1], []) );
                        moves = moves.concat( AIPlayer.identifySidestepMoves(space, line[i-1]) );
                    }
                }
            } );
        } );
        return moves;
    },
    identifyInlineMoves: function (space, nextSpace, neighbours) {
        var result = [];
        if ( !nextSpace.isOffBoard() && GameState.getMarbleAt(nextSpace) == 0 ) {
            var move1 = {"from": space.id, "to": nextSpace.id};
            var move2, move3;
            result.push([move1]);
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
                //console.log("IdentifyInlineMoves: " + lessThan2Neighbours.message);
                // Just continue. Not an actual problem.
            }
        }
        return result;
    },
    identifyPushingMoves: function (space, pushedSpaces, neighbours) {
        result = [];
        if ( GameState.getMarbleAt( pushedSpaces[0] ) == AIPlayer.opponent.playerNumber ) {
            if ( GameState.getMarbleAt( pushedSpaces[1] ) == 0 ) { // Pushing a single marble.
                // 2 pushing 1.
                if ( GameState.getMarbleAt( neighbours[0] ) == GameState.currentPlayer ) {
                    var move1 = {"from": pushedSpaces[0].id, "to": pushedSpaces[1].id};
                    var move2 = {"from": space.id, "to": pushedSpaces[0].id};
                    var move3 = {"from": neighbours[0].id, "to": space.id};
                    result.push([move1, move2, move3]);
                    // 3 pushing 1.
                    if ( neighbours[1] && GameState.getMarbleAt( neighbours[1] ) == GameState.currentPlayer ) {
                        var move4 = {"from": neighbours[1].id, "to": neighbours[0].id};
                        result.push([move1, move2, move3, move4]);
                    }
                }
            } else if ( GameState.getMarbleAt( pushedSpaces[1]) == AIPlayer.opponent.playerNumber
                        && pushedSpaces[2] && GameState.getMarbleAt( pushedSpaces[2] ) == 0 ) { // Pushing two marbles.
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
    identifySidestepMoves: function (space, target) {
        var result = [];
        if ( !space.isOffBoard() && !target.isOffBoard() && GameState.getMarbleAt(target) == 0 ) {
            $.each(Lines.getNeighbourSpaces(space), function (i, spaceNeighbour) {
                if (!spaceNeighbour.isOffBoard() && GameState.getMarbleAt(spaceNeighbour) == AIPlayer.playerNumber) {
                    $.each(Lines.getNeighbourSpaces(target), function (j, targetNeighbour) {
                        if (!targetNeighbour.isOffBoard() && GameState.getMarbleAt(targetNeighbour) == 0 &&
                                Lines.getNeighbourSpaces(spaceNeighbour).indexOf(targetNeighbour) != -1) {
                            // 2-marble sidestep.
                            var move1 = {"from": space.id, "to": target.id};
                            var move2 = {"from": spaceNeighbour.id, "to": targetNeighbour.id};
                            result.push([move1, move2]);
                            // Check for 3-marble sidestep.
                            var spaceLine = Lines.getLineForSpaces(space, spaceNeighbour);
                            var targetLine = Lines.getLineForSpaces(target, targetNeighbour);
                            var direction = spaceLine.indexOf(spaceNeighbour) - spaceLine.indexOf(space);
                            var nextSpace = spaceLine.indexOf(spaceNeighbour) + direction;
                            var nextTarget = targetLine.indexOf(targetNeighbour) + direction;
                            if ( GameState.getMarbleAt(spaceLine[nextSpace]) == AIPlayer.playerNumber &&
                                    GameState.getMarbleAt(targetLine[nextTarget]) == 0 ) {
                                var move3 = {"from": spaceLine[nextSpace].id, "to": targetLine[nextTarget].id};
                                result.push([move1, move2, move3]);
                            }
                        }
                    } );
                }
            } );
        }
        return result;
    }
}