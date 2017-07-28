var MouseListener = {
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
	pressMarble: function (marble, event) {
	    if (!MouseListener.isHuman) return;
	    // Only continue if human player is current.
		MouseListener.dragged = false;
		MouseListener.isAlreadySelected = false;
		if(!MouseListener.finished) {
            MouseListener.draggingToSpace = null;
            MouseListener.currentMarble = null;
            MouseListener.draggedFromX = event.stageX / window.isoScale;
			MouseListener.draggedFromY = event.stageY / window.isoScale;
			if ((SelectedMarbles.contains(marble))) {
				// Clicking or dragging a selected marble
				MouseListener.currentMarble = marble;
				MouseListener.isAlreadySelected = true;
			} else {
				// Clicking or dragging a non-selected marble
				MouseListener.isAlreadySelected = false;
				if (GameState.currentPlayer == marble.getPlayer()) {
					// User clicked on their own marble.
					MouseListener.currentMarble = marble;
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

		if (!MouseListener.isAlreadySelected && MouseListener.currentMarble) {
			SelectedMarbles.addMarble(MouseListener.currentMarble);
		}
		MouseListener.isValidDrag = true;
		MouseListener.isValidated = false;
	},
	releaseMarble: function (marble, event) {
		if (!MouseListener.dragged) { // Have clicked a marble
			if (MouseListener.isAlreadySelected && SelectedMarbles.contains(marble)) {
				if (SelectedMarbles.size() < 3 || SelectedMarbles.get(2) === marble) {
					SelectedMarbles.removeMarble(marble);
				} else { // Do not deselect only middle marble.
					var line = null;
					if (MouseListener.currentMarble) {
						line = Lines.getLineForSpaces(SelectedMarbles.get(0).getSpace(), SelectedMarbles.get(1).getSpace());
					}
					var indices = [];
					indices.push(line.indexOf(SelectedMarbles.get(0).getSpace()));
					indices.push(line.indexOf(SelectedMarbles.get(1).getSpace()));
					indices.push(line.indexOf(SelectedMarbles.get(2).getSpace()));
					indices.sort();
					var currentIndex = line.indexOf(MouseListener.currentMarble.getSpace());
					if (indices[1] != currentIndex) { // Marble is at either end of the row, so deselect.
						SelectedMarbles.removeMarble(MouseListener.currentMarble);
					}
				}
			} else {
				MouseListener.dragged = false;
			}
		} else if (MouseListener.isValidDrag && MouseListener.draggingToSpace) {// Have dragged a marble.
			if(MouseListener.isHuman && !MouseListener.finished) {
				var currentX = marble.getSpace().getX();
				var currentY = marble.getSpace().getY();
				var targetX = MouseListener.draggingToSpace.getX();
				var targetY = MouseListener.draggingToSpace.getY();
				var minChangeX = Math.abs(targetX - currentX) / 2;
				var minChangeY = Math.abs(targetY - currentY) / 2;
				var dropPointX = event.stageX / window.isoScale;
				var dropPointY = event.stageY / window.isoScale;
				var xChange = Math.abs(dropPointX - currentX);
				var yChange = Math.abs(dropPointY - currentY);
				if (xChange < minChangeX || yChange < minChangeY) {
					// Marble wasn't dragged far enough from its starting point.
					MouseListener.resetMarbles();
				} else {
					// Identify the new space for each moving marble
					var moves = [];

					var addMove = function (marble) {
						//console.log("addMove called on marble at " + marble.getSpace().getId());
						var neighbours = Lines.getNeighbourSpaces(marble);
						var targetSpace = MouseListener.moveMarbleTo(marble, neighbours, minChangeX, minChangeY);
						//console.log("neighbours: ", neighbours.toString());
						//console.log("targetSpace: ", targetSpace);
						var move = {};
						move.from = marble.getSpace().getId();
						move.to = targetSpace.getId();
						moves.push(move);
						if (targetSpace.isOffBoard()) {
							//console.log("Gone to offboard? " + targetSpace.getId());
							marble.remove();
						} else {
							//console.log("Player " + marble.getPlayer() + ": " + marble.getSpace().getId() + " -> " + targetSpace.getId());
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
						//console.log("less than three selected");
					}
					SelectedMarbles.clearMarbles();
					try {
						addMove(PushedMarbles.get(0));
						addMove(PushedMarbles.get(1));
					} catch (lessThanTwoPushed) {
						//console.log("Less than two pushed");
					}
					PushedMarbles.clearMarbles();

					// Notify the backend player controller.
					HumanPlayer.makeMove(moves);
				}
				MouseListener.dragged = false;
				window.stage.update();
			}
		}
	},
    dragMarble: function (marble, event) {
		if(MouseListener.isHuman && !MouseListener.finished && MouseListener.currentMarble) {
			MouseListener.dragged = true;
			// Convert physical drag dimensions to marble's abstract dimensions.
			var draggedToX = event.stageX / window.isoScale;
			var draggedToY = event.stageY / window.isoScale;
			var xMove = draggedToX - MouseListener.draggedFromX;
			var yMove = draggedToY - MouseListener.draggedFromY;
			marble.move(xMove, yMove);
			// Correct xMove and yMove to fit line.
			var targetSpace = MouseListener.draggingMarbleTo(marble, Lines.getNeighbourSpaces(marble));
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
			if (!MouseListener.draggingToSpace && (Math.abs(xMove) > Constants.minXMove || Math.abs(yMove) > Constants.minYMove) ) {
				MouseListener.draggingToSpace = targetSpace;
			} else if (MouseListener.draggingToSpace && MouseListener.draggingToSpace != targetSpace){
				MouseListener.isValidDrag = false;
				MouseListener.isValidated = false;
				MouseListener.draggingToSpace = null;
				MouseListener.resetMarbles();
			}

			if (targetSpace.isOffBoard()) {
				// Dragging to an offboard space isn't allowed.
				MouseListener.isValidDrag = false;
			} else if (MouseListener.isValidDrag && MouseListener.draggingToSpace && !MouseListener.isValidated) {
				/*//console.log("Validating move.");*/
				MouseListener.isValidated = true;
				// Find line which current marble is being dragged on.
				var line = Lines.getLineForSpaces(MouseListener.currentMarble.getSpace(), targetSpace);
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
				var direction = line.indexOf(targetSpace) - line.indexOf(MouseListener.currentMarble.getSpace());
				if (inline) { // Drag in-line.
					var selected = SelectedMarbles.getMarbles();
					for (i = 0; i < selected.length; i++) {
						var thisMarble = selected[i];
						var nextIndex = line.indexOf(thisMarble.getSpace()) + direction;
						var pushSpace = line[nextIndex];
						// Marble can't be pushed out.
						if (pushSpace.isOffBoard()) {
							MouseListener.isValidDrag = false;
							break;
						}
						// Identify if marbles are being pushed.
						var pushMarble = pushSpace.getMarble();
						if (pushMarble == null) {
							MouseListener.resetPushed();
							break;
						} else {
							if (pushMarble.getPlayer() == MouseListener.currentMarble.getPlayer()) {
								// Don't move to space occupied by own unselected marble.
								if (!SelectedMarbles.contains(pushMarble)) {
									MouseListener.isValidDrag = false;
									break;
								}
							} else {
								if(!PushedMarbles.isEmpty()) {
									// Clear pushed marbles if push direction changed.
									var pushIndex = line.indexOf(pushMarble.getSpace());
									var heldIndex = line.indexOf(PushedMarbles.get(0).getSpace());
									if (pushIndex > (heldIndex + 1) || pushIndex < (heldIndex - 1)){
										MouseListener.resetPushed();
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
										MouseListener.isValidDrag = false;
										MouseListener.resetPushed();
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
											MouseListener.isValidDrag = false;
											MouseListener.resetPushed();
											break;
										}
									}
								}
							}
						}
					}
				} else { // Not inline.
					MouseListener.resetPushed();
					var selected = SelectedMarbles.getMarbles();
					var checkMove = function (marble) {
						// Identify which neighbour the marble is being dragged to.
						targetSpace = MouseListener.draggingMarbleTo(marble, Lines.getNeighbourSpaces(marble));
						// Identify if the marble is moving to a valid space.
						if (targetSpace.isOffBoard() || targetSpace.getMarble() != null) {
							MouseListener.isValidDrag = false;   // Single marble or Side-step can't push any other marble.
						}
					}
					try {
						checkMove(SelectedMarbles.get(0));
						checkMove(SelectedMarbles.get(1));
						checkMove(SelectedMarbles.get(2));
					} catch (lessThanThreeMarblesSelected) {
						//console.log("less than three selected");
					}
				}
			}

			if (!MouseListener.isValidDrag) {
				MouseListener.resetMarbles();
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
        MouseListener.resetPushed();
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
