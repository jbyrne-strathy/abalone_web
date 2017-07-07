var BoardListener = {
	player1: null,
	player2: null,
	isHuman: true,
	currentMarble: null,
	draggingToSpace: null,
	draggedFromX: 0,
	draggedFromY: 0,
	dragged: false,
	finished: false,
	isAlreadySelected: false,
	isValidDrag: true,
	isValidated: false,
    create: function (player1, player2) {
        BoardListener.player1 = player1 || HumanPlayer;
        BoardListener.player2 = player2 || AIPlayer;
    },
	pressMarble: function (marble, event) {
	    if (!BoardListener.isHuman) return;
	    // Only continue if human player is current.
		BoardListener.dragged = false;
		BoardListener.isAlreadySelected = false;
		if(!BoardListener.finished) {
            BoardListener.draggingToSpace = null;
            BoardListener.currentMarble = null;
            BoardListener.draggedFromX = event.stageX / window.isoScale;
			BoardListener.draggedFromY = event.stageY / window.isoScale;
			if ((SelectedMarbles.contains(marble))) {
				// Clicking or dragging a selected marble
				BoardListener.currentMarble = marble;
				BoardListener.isAlreadySelected = true;
			} else {
				// Clicking or dragging a non-selected marble
				BoardListener.isAlreadySelected = false;
				if (GameState.currentPlayer == marble.getPlayer()) {
					// User clicked on their own marble.
					BoardListener.currentMarble = marble;
					if ( !(SelectedMarbles.isEmpty()) ) {
						//Get lines which marble is on.
						var onLines = Lines.getLinesForSpace(marble.getSpace());
						if (SelectedMarbles.size() == 3) {
							// 3 marbles already selected.  Deselect all
							SelectedMarbles.clearMarbles();
						} else if (SelectedMarbles.size() == 2) {
							// 2 marbles already selected.  Is selected marble inline?
							// Get line which selected marbles are on.
							var selectedLine = Lines.getLineForSpaces(SelectedMarbles.get(0).getSpace(), SelectedMarbles.get(1).getSpace());
							if (onLines.indexOf(selectedLine) == -1) {
								// Current marble is not in-line with selected marbles.
								SelectedMarbles.clearMarbles();
							} else {
								// Check whether the marble is a neighbour and inline with both selected marbles
								var i0 = selectedLine.indexOf(SelectedMarbles.get(0).getSpace());
								var i1 = selectedLine.indexOf(SelectedMarbles.get(1).getSpace());
								if ((selectedLine[i0 - 1] == null || selectedLine[i0 - 1].getId() != marble.getSpace().getId())
								 && (selectedLine[i0 + 1] == null || selectedLine[i0 + 1].getId() != marble.getSpace().getId())
								 && (selectedLine[i1 - 1] == null || selectedLine[i1 - 1].getId() != marble.getSpace().getId())
								 && (selectedLine[i1 + 1] == null || selectedLine[i1 + 1].getId() != marble.getSpace().getId())) {
									SelectedMarbles.clearMarbles();
								}
							}
						} else if (SelectedMarbles.size() == 1) {
							// Only 1 marble already selected. Is selected marble a neighbour?
							var isNeighbour = function (i) {
								var line = onLines[i];
								var index = line.indexOf(marble.getSpace());
								var prev = line[index - 1];
								var next = line[index + 1];
								if ((prev != null && prev.getId() == SelectedMarbles.get(0).getSpace().getId()) ||
									(next != null && next.getId() == SelectedMarbles.get(0).getSpace().getId())) {
										return true;
								}
								return false;
							};
							if( !isNeighbour(0) && !isNeighbour(1) && !isNeighbour(2) ) {
								SelectedMarbles.clearMarbles();
							}
						}
					}
				}
			}
		}

		if (!BoardListener.isAlreadySelected && BoardListener.currentMarble) {
			SelectedMarbles.addMarble(BoardListener.currentMarble);
		}
		BoardListener.isValidDrag = true;
		BoardListener.isValidated = false;
	},
	releaseMarble: function (marble, event) {
		if (!BoardListener.dragged) { // Have clicked a marble
			if (BoardListener.isAlreadySelected && SelectedMarbles.contains(marble)) {
				if (SelectedMarbles.size() < 3 || SelectedMarbles.get(2) === marble) {
					SelectedMarbles.removeMarble(marble);
				} else { // Do not deselect only middle marble.
					var line = null;
					if (BoardListener.currentMarble) {
						line = Lines.getLineForSpaces(SelectedMarbles.get(0).getSpace(), SelectedMarbles.get(1).getSpace());
					}
					var indices = [];
					indices.push(line.indexOf(SelectedMarbles.get(0).getSpace()));
					indices.push(line.indexOf(SelectedMarbles.get(1).getSpace()));
					indices.push(line.indexOf(SelectedMarbles.get(2).getSpace()));
					indices.sort();
					var currentIndex = line.indexOf(BoardListener.currentMarble.getSpace());
					if (indices[1] != currentIndex) { // Marble is at either end of the row, so deselect.
						SelectedMarbles.removeMarble(BoardListener.currentMarble);
					}
				}
			} else {
				BoardListener.dragged = false;
			}
		} else if (BoardListener.isValidDrag && BoardListener.draggingToSpace) {// Have dragged a marble.
			if(BoardListener.isHuman && !BoardListener.finished) {
				var currentX = marble.getSpace().getX();
				var currentY = marble.getSpace().getY();
				var targetX = BoardListener.draggingToSpace.getX();
				var targetY = BoardListener.draggingToSpace.getY();
				var minChangeX = Math.abs(targetX - currentX) / 2;
				var minChangeY = Math.abs(targetY - currentY) / 2;
				var dropPointX = event.stageX / window.isoScale;
				var dropPointY = event.stageY / window.isoScale;
				var xChange = Math.abs(dropPointX - currentX);
				var yChange = Math.abs(dropPointY - currentY);
				if (xChange < minChangeX || yChange < minChangeY) {
					// Marble wasn't dragged far enough from its starting point.
					BoardListener.resetMarbles();
				} else {
					// Identify the new space for each moving marble
					var moves = [];

					var addMove = function (marble) {
						console.log("addMove called on marble at " + marble.getSpace().getId());
						var neighbours = Lines.getNeighbourSpaces(marble);
						var targetSpace = BoardListener.moveMarbleTo(marble, neighbours, minChangeX, minChangeY);
						console.log("neighbours: ", neighbours.toString());
						console.log("targetSpace: ", targetSpace);
						var move = {};
						move.from = marble.getSpace().getId();
						move.to = targetSpace.getId();
						moves.push(move);
						if (targetSpace.getId().length > 2) {
							console.log("Gone to offboard? " + targetSpace.getId());
							marble.remove();
						} else {
							console.log("Player " + marble.getPlayer() + ": " + marble.getSpace().getId() + " -> " + targetSpace.getId());
							if(marble.getSpace().getMarble() === marble) {
								marble.getSpace().setMarble(null);
							}
							marble.setSpace(targetSpace);
							targetSpace.setMarble(marble);
						}
						/*return true;*/
					}
					try {
						addMove(SelectedMarbles.get(0));
						addMove(SelectedMarbles.get(1));
						addMove(SelectedMarbles.get(2));
					} catch (lessThanThreeSelected) {
						console.log("less than three selected");
					}
					SelectedMarbles.clearMarbles();
					try {
						addMove(PushedMarbles.get(0));
						addMove(PushedMarbles.get(1));
					} catch (lessThanTwoPushed) {
						console.log("Less than two pushed");
					}
					PushedMarbles.clearMarbles();

					// Notify the backend player controller.
					HumanPlayer.makeMove(moves);
				}
				BoardListener.dragged = false;
				window.stage.update();
			}
		}
	},
    dragMarble: function (marble, event) {
		if(BoardListener.isHuman && !BoardListener.finished && BoardListener.currentMarble) {
			BoardListener.dragged = true;
			// Convert physical drag dimensions to marble's abstract dimensions.
			var draggedToX = event.stageX / window.isoScale;
			var draggedToY = event.stageY / window.isoScale;
			var xMove = draggedToX - BoardListener.draggedFromX;
			var yMove = draggedToY - BoardListener.draggedFromY;
			marble.move(xMove, yMove);
			// Correct xMove and yMove to fit line.
			var targetSpace = BoardListener.draggingMarbleTo(marble, Lines.getNeighbourSpaces(marble));
			var diffX = targetSpace.getX() - marble.getSpace().getX();
			var diffY = targetSpace.getY() - marble.getSpace().getY();
			yMove = (diffY * Math.abs(xMove)) / Math.abs(diffX);
			// Limit x- and y-moves to no more than 1 space.
			if (Math.abs(yMove) > Constants.yOffset) {
				var ySign = yMove / Math.abs(yMove);
				yMove = ySign * Constants.yOffset;
				if (Math.abs(xMove) > Constants.halfBoardSpacing) {
					var xSign = xMove / Math.abs(xMove);
					xMove = xSign * Constants.halfBoardSpacing;
				}
			} else if (Math.abs(xMove) > Constants.fullBoardSpacing) {
				var xSign = xMove / Math.abs(xMove);
				xMove = xSign * Constants.fullBoardSpacing;
			}

			// Move the marbles now. The must be moved so the next section can identify
			// whether all the moved marbles are valid or not.
			SelectedMarbles.move(xMove, yMove);
			PushedMarbles.move(xMove, yMove);

			// Identify globally, which neighbour the marble is being dragged to.
			// But only once the marble is moved a certain distance.
			// This avoids confusion with initial mouse juddering.
			if (!BoardListener.draggingToSpace && (Math.abs(xMove) > Constants.minXMove || Math.abs(yMove) > Constants.minYMove) ) {
				BoardListener.draggingToSpace = targetSpace;
			} else if (BoardListener.draggingToSpace && BoardListener.draggingToSpace != targetSpace){
				BoardListener.isValidDrag = false;
				BoardListener.isValidated = false;
				BoardListener.draggingToSpace = null;
				BoardListener.resetMarbles();
			}

			if (targetSpace.getId().length >=4) {
				// Dragging to an offboard space isn't allowed.
				BoardListener.isValidDrag = false;
			} else if (BoardListener.isValidDrag && BoardListener.draggingToSpace && !BoardListener.isValidated) {
				/*console.log("Validating move.");*/
				BoardListener.isValidated = true;
				// Find line which current marble is being dragged on.
				var line = Lines.getLineForSpaces(BoardListener.currentMarble.getSpace(), targetSpace);
				// Are the selected marbles being dragged in-line?
				var inline = true;
				if (SelectedMarbles.size() == 1) {
					inline = false; // Only a single marble.
				} else {
					var selectedMarbles = SelectedMarbles.getMarbles();
					if (line.indexOf(selectedMarbles[0].getSpace()) == -1 || line.indexOf(selectedMarbles[1].getSpace()) == -1) {
						inline = false; // If draggine marles inline, all 3 marbles will be in the same line
					}
				}
				// Get direction that the marble is being dragged.
				var direction = line.indexOf(targetSpace) - line.indexOf(BoardListener.currentMarble.getSpace());
				if (inline) { // Drag in-line.
					var selected = SelectedMarbles.getMarbles();
					for (i = 0; i < selected.length; i++) {
						var thisMarble = selected[i];
						var nextIndex = line.indexOf(thisMarble.getSpace()) + direction;
						var pushSpace = line[nextIndex];
						// Marble can't be pushed out.
						if (pushSpace.getId().length > 3) {
							BoardListener.isValidDrag = false;
							break;
						}
						// Identify if marbles are being pushed.
						var pushMarble = pushSpace.getMarble();
						if (pushMarble == null) {
							BoardListener.resetPushed();
							break;
						} else {
							if (pushMarble.getPlayer() == BoardListener.currentMarble.getPlayer()) {
								// Don't move to space occupied by own unselected marble.
								if (!SelectedMarbles.contains(pushMarble)) {
									BoardListener.isValidDrag = false;
									break;
								}
							} else {
								if(!PushedMarbles.isEmpty()) {
									// Clear pushed marbles if push direction changed.
									var pushIndex = line.indexOf(pushMarble.getSpace());
									var heldIndex = line.indexOf(PushedMarbles.get(0).getSpace());
									if (pushIndex > (heldIndex + 1) || pushIndex < (heldIndex - 1)){
										BoardListener.resetPushed();
									}
								}
								// Push opponent's marbles if less in-line.
								PushedMarbles.addMarble(pushMarble);
								nextIndex += direction;
								pushSpace = line[nextIndex];
								if (pushSpace != null) {
									pushMarble = pushSpace.getMarble();
								} else {
									pushMarble = null;
								}
								if (pushMarble != null) {
									if (SelectedMarbles.size() == 2 || pushMarble.getPlayer() == GameState.currentPlayer) {
										// 2 marbles can't push if 2 opponent marbles or single marble blocked by own piece.
										BoardListener.isValidDrag = false;
										BoardListener.resetPushed();
										break;
									} else {
										PushedMarbles.addMarble(pushMarble);
										nextIndex = line.indexOf(pushSpace) + direction;
										pushSpace = line[nextIndex];
										if (pushSpace != null) {
											pushMarble = pushSpace.getMarble();
										} else {
											pushMarble = null;
										}
										if (pushMarble != null) {
											// Either 3 opponent marbles or 2 blocked by own marble.
											BoardListener.isValidDrag = false;
											BoardListener.resetPushed();
											break;
										}
									}
								}
							}
						}
					}
				} else { // Not inline.
					BoardListener.resetPushed();
					var selected = SelectedMarbles.getMarbles();
					var checkMove = function (marble) {
						// Identify which neighbour the marble is being dragged to.
						targetSpace = BoardListener.draggingMarbleTo(marble, Lines.getNeighbourSpaces(marble));
						// Identify if the marble is moving to a valid space.
						if (targetSpace.getId().length >= 4 || targetSpace.getMarble() != null) {
							BoardListener.isValidDrag = false;   // Single marble or Side-step can't push any other marble.
						}
					}
					try {
						checkMove(SelectedMarbles.get(0));
						checkMove(SelectedMarbles.get(1));
						checkMove(SelectedMarbles.get(2));
					} catch (lessThanThreeMarblesSelected) {
						console.log("less than three selected");
					}
				}
			}

			if (!BoardListener.isValidDrag) {
				BoardListener.resetMarbles();
			}
        }
    },
	draggingMarbleTo: function (marble, spaces) {
        var closest = marble.getSpace();   // Initialise with marble's current space.
        var distance = Constants.fullBoardSpacing; // Initialise with maximum possible distance from neighbour space.
		var checkIfClosest = function (space) {
            var xDistance = Math.abs(space.getX() - marble.getX());
            var yDistance = Math.abs(space.getY() - marble.getY());
            var dist = Math.sqrt((xDistance*xDistance) + (yDistance*yDistance));
            if(dist <= distance){
                distance = dist;
                closest = space;
            }
        }
		try {
			checkIfClosest(spaces[0]);
			checkIfClosest(spaces[1]);
			checkIfClosest(spaces[2]);
			checkIfClosest(spaces[3]);
			checkIfClosest(spaces[4]);
			checkIfClosest(spaces[5]);
		} catch (lessThanSixSpaces) {
			// Ignore it
		} finally {
        	return closest;
		}
    },
    moveMarbleTo: function (marble, spaces, xMidPoint, yMidPoint) {
        var canMoveTo = function (space) {
            var xDistance = Math.abs(space.getX() - marble.getX());
            var yDistance = Math.abs(space.getY() - marble.getY());
            if(xDistance <= xMidPoint && yDistance <= yMidPoint){
                return space;
            }
			return false;
        }
		return canMoveTo(spaces[0]) || canMoveTo(spaces[1]) || canMoveTo(spaces[2]) || canMoveTo(spaces[3]) || canMoveTo(spaces[4]) || canMoveTo(spaces[5]);
    },
    resetMarbles: function ( ) {
		var selected = SelectedMarbles.getMarbles();
		for(i = 0; i < selected.length; i++) {
			var marble = selected[i];
            marble.setPos(marble.getSpace().getX(), marble.getSpace().getY());
        }
		SelectedMarbles.draw();
        BoardListener.resetPushed();
    },
	resetPushed: function ( ) {
		var pushed = PushedMarbles.getMarbles();
		for(i = 0; i < pushed.length; i++) {
			var marble = pushed[i];
            marble.setPos(marble.getSpace().getX(), marble.getSpace().getY());
        }
		PushedMarbles.draw();
        PushedMarbles.clearMarbles();
    }
};
