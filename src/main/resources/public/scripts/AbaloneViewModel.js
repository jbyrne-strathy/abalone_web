function AbaloneViewModel() {
    const self = this;

    /* NAVIGATION */
    this.visibleSection = ko.observable(null);

    this.goToLogin = function () {
        self.visibleSection(Constants.sections.login);
    };

    this.goToCreateAccount = function () {
        self.visibleSection(Constants.sections.createAccount);
    };

    this.goToLeaderboard = function () {
        self.visibleSection(Constants.sections.leaderboard);
    };

    this.goToLobby = function () {
        self.visibleSection(Constants.sections.lobby);
    };

    this.goToChallenge = function () {
        self.visibleSection(Constants.sections.challengeReceived);
    };

    this.goToWaiting = function () {
        self.visibleSection(Constants.sections.challengeSent);
    };

    this.goToGame = function () {
        self.visibleSection(Constants.sections.game);
    };

    this.leaveLobby = function () {
        Requests.leaveLobby();
    };

    /* LOGIN / CREATE ACCOUNT */
    this.loginError = ko.observable(false);
    this.invalidUsername = ko.observable(false);
    this.username = ko.observable();
    this.password = ko.observable();

    this.completeLogin = function (token) {
        sessionStorage.token = token;
        sessionStorage.name = self.username();
        self.password('');
        self.goToLobby();
        Requests.joinLobby(self.updateLobby, self.handleError);
    };

    this.login = function () {
        self.loginError(false);
        Requests.login(self.username(), self.password(),
            self.completeLogin, self.handleLoginError);
    };

    this.handleLoginError = function (error) {
        console.log("handleLoginError", JSON.stringify(error));
        self.loginError(true);
    };

    this.createAccount = function () {
        self.invalidUsername(false);
        Requests.createAccount(self.username(), self.password(),
            self.goToLogin, self.handleCreateAccountError);
    };

    this.handleCreateAccountError = function (error) {
        console.log("handleCreateAccountError", JSON.stringify(error));
        self.invalidUsername(true);
    };

    /* LOBBY */
    this.lobby = ko.observableArray();
    this.challenger = ko.observable();
    this.challenged = ko.observable();

    this.updateLobby = function (lobby) {
        const updatePlayers = function (players) {
            self.lobby.removeAll();
            for (let i = 0; i < players.length; i++) {
                if (players[i].name === sessionStorage.name) {
                    players.splice(i, 1);
                    break;
                }
            }
            self.lobby(players);
        };
        if (self.visibleSection() === Constants.sections.lobby) {
            updatePlayers(lobby.players);

            if (lobby.challenges) {
                for (let i = 0; i < lobby.challenges.length; i++) {
                    let challenge = lobby.challenges[i];
                    if (challenge.challenged.name === sessionStorage.name) {
                        self.challenger(challenge.challenger.name);
                        self.goToChallenge();
                        break;
                    }
                }
            }
        } else if (self.visibleSection() === Constants.sections.challengeSent) {
            let ourChallenge = lobby.challenges.find(
                function (challenge) {
                    return challenge.challenger.name === sessionStorage.name
                });
            if (!ourChallenge) {
                updatePlayers(lobby.players);
                self.goToLobby();
            } else if (ourChallenge.gameID) {
                self.loadGame(ourChallenge.gameID);
            }
        }
        Requests.getLobbyUpdate(self.updateLobby, self.handleError);
    };

    this.sendChallenge = function (player) {
        self.challenged(player.name);
        Requests.sendChallenge(player.name, self.goToWaiting, self.handleError);
    };

    this.acceptChallenge = function () {
        Requests.answerChallenge(true, self.loadGame, self.handleError);
    };

    this.rejectChallenge = function () {
        Requests.answerChallenge(false, self.goToLobby, self.handleError);
    };

    /* GAME */
    this.stage = null;
    this.isoScale = 0.0;

    this.myNumber = 0;

    this.gameState = {};
    this.spaces = {};
    this.offBoard = {};
    this.lines = [];
    this.selectedMarbles = [];
    this.selectedMarbleCircles = [];
    this.pushedMarbles = [];
    this.player1Score = null;
    this.player1Name = null;
    this.player2Score = null;
    this.player2Name = null;

    this.configureWindow = function () {
        let w = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
        let h = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
        let xScale = w / Constants.boardWidth;
        let yScale = h / Constants.boardHeight;

        self.isoScale = Math.min(xScale, yScale);
        self.stage.scaleX = self.stage.scaleY = self.isoScale;
        self.stage.canvas.height = h;
        self.stage.canvas.width = h * (Constants.boardWidth / Constants.boardHeight);
        self.stage.update();
    };

    this.endGame = function () {
        self.finished = true;
        alert("Game over. Player " + self.gameState.winner + " has won!");

        self.goToLobby();
    };

    this.movePushedMarbles = function (xTransform, yTransform) {
        try {
            self.pushedMarbles[0].move(xTransform, yTransform);
            self.pushedMarbles[1].move(xTransform, yTransform);
            self.pushedMarbles[2].move(xTransform, yTransform);
        } catch (error) {
            // Ignore it.
        }
    };

    this.moveSelectedMarbles = function (xTransform, yTransform) {
        try {
            self.selectedMarbles[0].move(xTransform, yTransform);
            self.selectedMarbles[1].move(xTransform, yTransform);
            self.selectedMarbles[2].move(xTransform, yTransform);
        } catch (error) {
            // Ignore it.
        }
    };

    this.addPushedMarble = function (marble) {
        if(!self.pushedMarbles.includes(marble)) {
            self.pushedMarbles.push(marble);
        }
    };

    this.addSelectedMarble = function (marble) {
        if(!self.selectedMarbles.includes(marble)) {
            self.selectedMarbles.push(marble);
            marble.select();
            self.stage.update();
        }
    };

    this.removePushedMarble = function (marble) {
        let i = self.pushedMarbles.indexOf(marble);
        self.pushedMarbles.splice(i, 1);
    };

    this.removeSelectedMarble = function (marble) {
        let i = self.selectedMarbles.indexOf(marble);
        self.selectedMarbles.splice(i, 1);
        marble.deselect();
        self.stage.update();
    };

    this.drawSelectedMarbles = function () {
        let drawMarble = function (index) {
            self.selectedMarbleCircles[index].x = self.selectedMarbles[index].getX();
            self.selectedMarbleCircles[index].y = self.selectedMarbles[index].getY();
            self.selectedMarbleCircles[index].graphics
                .setStrokeStyle(10)
                .beginStroke(Constants.selectedMarbleColor)
                .drawCircle(0, 0, Constants.marbleRadius);
        };
        try {
            drawMarble(0);
            drawMarble(1);
            drawMarble(2);
        } catch (error) {
            // Ignore it.
        } finally {
            self.stage.update();
        }
    };

    this.getLinesForSpace = function (space) {
        let reply = [];
        let checkLine = function (i) {
            if (self.lines[i].indexOf(space) > -1) {
                reply.push(self.lines[i]);
            }
        };
        checkLine(0); checkLine(1); checkLine(2); checkLine(3); checkLine(4); checkLine(5); checkLine(6); checkLine(7); checkLine(8); checkLine(9); checkLine(10); checkLine(11); checkLine(12); checkLine(13); checkLine(14); checkLine(15); checkLine(16); checkLine(17); checkLine(18); checkLine(19); checkLine(20); checkLine(21); checkLine(22); checkLine(23); checkLine(24); checkLine(25); checkLine(26);
        return reply;
    };

    this.getLineForSpaces = function (space1, space2) {
        let checkLine = function (i) {
            if (self.lines[i].indexOf(space1) > -1 && self.lines[i].indexOf(space2) > -1) {
                return self.lines[i];
            } else {
                return false;
            }
        };
        return checkLine(0) || checkLine(1) || checkLine(2) || checkLine(3) || checkLine(4) || checkLine(5) || checkLine(6) || checkLine(7) || checkLine(8) || checkLine(9) || checkLine(10) || checkLine(11) || checkLine(12) || checkLine(13) || checkLine(14) || checkLine(15) || checkLine(16) || checkLine(17) || checkLine(18) || checkLine(19) || checkLine(20) || checkLine(21) || checkLine(22) || checkLine(23) || checkLine(24) || checkLine(25) || checkLine(26);
    };

    this.getNeighbourSpaces = function (space) { // Can take either a marble or space.
        let neighbours = [];
        if (space.getSpace && typeof space.getSpace === "function") {
            space = space.getSpace();
        }
        let checkLine = function (line) {
            let index = line.indexOf(space);
            if (index > 0) {
                neighbours.push(line[(index - 1)]);
            }
            if (index < line.length-1) {
                neighbours.push(line[(index + 1)]);
            }
        };
        let onLines = self.getLinesForSpace(space);
        checkLine(onLines[0]);
        checkLine(onLines[1]);
        checkLine(onLines[2]);
        return neighbours;
    };

    this.createLines = function () {
        let spaces = self.spaces;
        let offBoard = self.offBoard;

        // Horizontal rows.
        self.lines[0] = [offBoard.out7, spaces.a1, spaces.a2, spaces.a3, spaces.a4, spaces.a5, offBoard.out8];
        self.lines[1] = [offBoard.out9, spaces.b1, spaces.b2, spaces.b3, spaces.b4, spaces.b5, spaces.b6, offBoard.out10];
        self.lines[2] = [offBoard.out11, spaces.c1, spaces.c2, spaces.c3, spaces.c4, spaces.c5, spaces.c6, spaces.c7, offBoard.out12];
        self.lines[3] = [offBoard.out13, spaces.d1, spaces.d2, spaces.d3, spaces.d4, spaces.d5, spaces.d6, spaces.d7, spaces.d8, offBoard.out14];
        self.lines[4] = [offBoard.out15, spaces.e1, spaces.e2, spaces.e3, spaces.e4, spaces.e5, spaces.e6, spaces.e7, spaces.e8, spaces.e9, offBoard.out16];
        self.lines[5] = [offBoard.out17, spaces.f1, spaces.f2, spaces.f3, spaces.f4, spaces.f5, spaces.f6, spaces.f7, spaces.f8, offBoard.out18];
        self.lines[6] = [offBoard.out19, spaces.g1, spaces.g2, spaces.g3, spaces.g4, spaces.g5, spaces.g6, spaces.g7, offBoard.out20];
        self.lines[7] = [offBoard.out21, spaces.h1, spaces.h2, spaces.h3, spaces.h4, spaces.h5, spaces.h6, offBoard.out22];
        self.lines[8] = [offBoard.out23, spaces.i1, spaces.i2, spaces.i3, spaces.i4, spaces.i5, offBoard.out24];

        // Diagonal from top-left
        self.lines[9] = [offBoard.out13, spaces.e1, spaces.f1, spaces.g1, spaces.h1, spaces.i1, offBoard.out26];
        self.lines[10] = [offBoard.out11, spaces.d1, spaces.e2, spaces.f2, spaces.g2, spaces.h2, spaces.i2, offBoard.out27];
        self.lines[11] = [offBoard.out9, spaces.c1, spaces.d2, spaces.e3, spaces.f3, spaces.g3, spaces.h3, spaces.i3, offBoard.out28];
        self.lines[12] = [offBoard.out7, spaces.b1, spaces.c2, spaces.d3, spaces.e4, spaces.f4, spaces.g4, spaces.h4, spaces.i4, offBoard.out29];
        self.lines[13] = [offBoard.out1, spaces.a1, spaces.b2, spaces.c3, spaces.d4, spaces.e5, spaces.f5, spaces.g5, spaces.h5, spaces.i5, offBoard.out30];
        self.lines[14] = [offBoard.out2, spaces.a2, spaces.b3, spaces.c4, spaces.d5, spaces.e6, spaces.f6, spaces.g6, spaces.h6, offBoard.out24];
        self.lines[15] = [offBoard.out3, spaces.a3, spaces.b4, spaces.c5, spaces.d6, spaces.e7, spaces.f7, spaces.g7, offBoard.out22];
        self.lines[16] = [offBoard.out4, spaces.a4, spaces.b5, spaces.c6, spaces.d7, spaces.e8, spaces.f8, offBoard.out20];
        self.lines[17] = [offBoard.out5, spaces.a5, spaces.b6, spaces.c7, spaces.d8, spaces.e9, offBoard.out18];

        // Diagonal from top-right
        self.lines[18] = [offBoard.out14, spaces.e9, spaces.f8, spaces.g7, spaces.h6, spaces.i5, offBoard.out29];
        self.lines[19] = [offBoard.out12, spaces.d8, spaces.e8, spaces.f7, spaces.g6, spaces.h5, spaces.i4, offBoard.out28];
        self.lines[20] = [offBoard.out10, spaces.c7, spaces.d7, spaces.e7, spaces.f6, spaces.g5, spaces.h4, spaces.i3, offBoard.out27];
        self.lines[21] = [offBoard.out8, spaces.b6, spaces.c6, spaces.d6, spaces.e6, spaces.f5, spaces.g4, spaces.h3, spaces.i2, offBoard.out26];
        self.lines[22] = [offBoard.out6, spaces.a5, spaces.b5, spaces.c5, spaces.d5, spaces.e5, spaces.f4, spaces.g3, spaces.h2, spaces.i1, offBoard.out25];
        self.lines[23] = [offBoard.out5, spaces.a4, spaces.b4, spaces.c4, spaces.d4, spaces.e4, spaces.f3, spaces.g2, spaces.h1, offBoard.out23];
        self.lines[24] = [offBoard.out4, spaces.a3, spaces.b3, spaces.c3, spaces.d3, spaces.e3, spaces.f2, spaces.g1, offBoard.out21];
        self.lines[25] = [offBoard.out3, spaces.a2, spaces.b2, spaces.c2, spaces.d2, spaces.e2, spaces.f1, offBoard.out19];
        self.lines[26] = [offBoard.out4, spaces.a1, spaces.b1, spaces.c1, spaces.d1, spaces.e1, offBoard.out17];
    };

    this.createBoard = function () {
        if (self.stage === null) {
            self.stage = new createjs.Stage("demoCanvas");
        } else {
            self.stage.removeAllChildren();
        }

        // Draw the background.
        let background = new createjs.Shape();
        background.graphics.beginFill(Constants.backgroundColor);
        background.graphics.drawRect(0, 0, Constants.boardWidth, Constants.boardHeight);
        self.stage.addChild(background);

        // Draw the board shape.
        let board = new createjs.Shape();
        let yOffset = Constants.yOffset, boardSpacing = Constants.halfBoardSpacing;
        board.graphics.setStrokeStyle(10);
        board.graphics.beginFill(Constants.boardColor);
        board.graphics.moveTo(boardSpacing*5, 0);
        board.graphics.lineTo(boardSpacing*15, 0);
        board.graphics.lineTo(Constants.boardWidth, Constants.boardHeight/2);
        board.graphics.lineTo(boardSpacing*15, Constants.boardHeight);
        board.graphics.lineTo(boardSpacing*5, Constants.boardHeight);
        board.graphics.lineTo(0, Constants.boardHeight/2);
        board.graphics.lineTo(boardSpacing*5, 0);
        self.stage.addChild(board);

        // Draw the player names and scores.
        self.player1Name = new createjs.Text(self.gameState.player1.name, Constants.textFont, Constants.textColor);
        self.player1Name.x = Constants.fullBoardSpacing - (self.player1Name.getBounds().width / 2);
        self.player1Name.y = Constants.halfBoardSpacing;
        self.stage.addChild(self.player1Name);

        self.player2Name = new createjs.Text(self.gameState.player2.name, Constants.textFont, Constants.textColor);
        self.player2Name.x = Constants.boardWidth - Constants.fullBoardSpacing  - (self.player2Name.getBounds().width / 2);
        self.player2Name.y = Constants.halfBoardSpacing;
        self.stage.addChild(self.player2Name);

        self.player1Score = new createjs.Text(self.gameState.player1Score.toString(), Constants.textFont, Constants.textColor);
        self.player1Score.x = Constants.fullBoardSpacing;
        self.player1Score.y = Constants.fullBoardSpacing;
        self.stage.addChild(self.player1Score);

        self.player2Score = new createjs.Text(self.gameState.player2Score.toString(), Constants.textFont, Constants.textColor);
        self.player2Score.x = Constants.boardWidth - Constants.fullBoardSpacing;
        self.player2Score.y = Constants.fullBoardSpacing;
        self.stage.addChild(self.player2Score);

        // Draw the spaces.
        self.spaces.a1 = new Space("a1", 6*boardSpacing, yOffset);
        self.spaces.a2 = new Space("a2", 8*boardSpacing, yOffset);
        self.spaces.a3 = new Space("a3", 10*boardSpacing, yOffset);
        self.spaces.a4 = new Space("a4", 12*boardSpacing, yOffset);
        self.spaces.a5 = new Space("a5", 14*boardSpacing, yOffset);
        self.spaces.b1 = new Space("b1", 5*boardSpacing, 2*yOffset);
        self.spaces.b2 = new Space("b2", 7*boardSpacing, 2*yOffset);
        self.spaces.b3 = new Space("b3", 9*boardSpacing, 2*yOffset);
        self.spaces.b4 = new Space("b4", 11*boardSpacing, 2*yOffset);
        self.spaces.b5 = new Space("b5", 13*boardSpacing, 2*yOffset);
        self.spaces.b6 = new Space("b6", 15*boardSpacing, 2*yOffset);
        self.spaces.c1 = new Space("c1", 4*boardSpacing, 3*yOffset);
        self.spaces.c2 = new Space("c2", 6*boardSpacing, 3*yOffset);
        self.spaces.c3 = new Space("c3", 8*boardSpacing, 3*yOffset);
        self.spaces.c4 = new Space("c4", 10*boardSpacing, 3*yOffset);
        self.spaces.c5 = new Space("c5", 12*boardSpacing, 3*yOffset);
        self.spaces.c6 = new Space("c6", 14*boardSpacing, 3*yOffset);
        self.spaces.c7 = new Space("c7", 16*boardSpacing, 3*yOffset);
        self.spaces.d1 = new Space("d1", 3*boardSpacing, 4*yOffset);
        self.spaces.d2 = new Space("d2", 5*boardSpacing, 4*yOffset);
        self.spaces.d3 = new Space("d3", 7*boardSpacing, 4*yOffset);
        self.spaces.d4 = new Space("d4", 9*boardSpacing, 4*yOffset);
        self.spaces.d5 = new Space("d5", 11*boardSpacing, 4*yOffset);
        self.spaces.d6 = new Space("d6", 13*boardSpacing, 4*yOffset);
        self.spaces.d7 = new Space("d7", 15*boardSpacing, 4*yOffset);
        self.spaces.d8 = new Space("d8", 17*boardSpacing, 4*yOffset);
        self.spaces.e1 = new Space("e1", 2*boardSpacing, 5*yOffset);
        self.spaces.e2 = new Space("e2", 4*boardSpacing, 5*yOffset);
        self.spaces.e3 = new Space("e3", 6*boardSpacing, 5*yOffset);
        self.spaces.e4 = new Space("e4", 8*boardSpacing, 5*yOffset);
        self.spaces.e5 = new Space("e5", 10*boardSpacing, 5*yOffset);
        self.spaces.e6 = new Space("e6", 12*boardSpacing, 5*yOffset);
        self.spaces.e7 = new Space("e7", 14*boardSpacing, 5*yOffset);
        self.spaces.e8 = new Space("e8", 16*boardSpacing, 5*yOffset);
        self.spaces.e9 = new Space("e9", 18*boardSpacing, 5*yOffset);
        self.spaces.f1 = new Space("f1", 3*boardSpacing, 6*yOffset);
        self.spaces.f2 = new Space("f2", 5*boardSpacing, 6*yOffset);
        self.spaces.f3 = new Space("f3", 7*boardSpacing, 6*yOffset);
        self.spaces.f4 = new Space("f4", 9*boardSpacing, 6*yOffset);
        self.spaces.f5 = new Space("f5", 11*boardSpacing, 6*yOffset);
        self.spaces.f6 = new Space("f6", 13*boardSpacing, 6*yOffset);
        self.spaces.f7 = new Space("f7", 15*boardSpacing, 6*yOffset);
        self.spaces.f8 = new Space("f8", 17*boardSpacing, 6*yOffset);
        self.spaces.g1 = new Space("g1", 4*boardSpacing, 7*yOffset);
        self.spaces.g2 = new Space("g2", 6*boardSpacing, 7*yOffset);
        self.spaces.g3 = new Space("g3", 8*boardSpacing, 7*yOffset);
        self.spaces.g4 = new Space("g4", 10*boardSpacing, 7*yOffset);
        self.spaces.g5 = new Space("g5", 12*boardSpacing, 7*yOffset);
        self.spaces.g6 = new Space("g6", 14*boardSpacing, 7*yOffset);
        self.spaces.g7 = new Space("g7", 16*boardSpacing, 7*yOffset);
        self.spaces.h1 = new Space("h1", 5*boardSpacing, 8*yOffset);
        self.spaces.h2 = new Space("h2", 7*boardSpacing, 8*yOffset);
        self.spaces.h3 = new Space("h3", 9*boardSpacing, 8*yOffset);
        self.spaces.h4 = new Space("h4", 11*boardSpacing, 8*yOffset);
        self.spaces.h5 = new Space("h5", 13*boardSpacing, 8*yOffset);
        self.spaces.h6 = new Space("h6", 15*boardSpacing, 8*yOffset);
        self.spaces.i1 = new Space("i1", 6*boardSpacing, 9*yOffset);
        self.spaces.i2 = new Space("i2", 8*boardSpacing, 9*yOffset);
        self.spaces.i3 = new Space("i3", 10*boardSpacing, 9*yOffset);
        self.spaces.i4 = new Space("i4", 12*boardSpacing, 9*yOffset);
        self.spaces.i5 = new Space("i5", 14*boardSpacing, 9*yOffset);

        for (let spaceId in self.spaces) {
            if (self.spaces.hasOwnProperty(spaceId)) {
                let space = self.spaces[spaceId];
                self.stage.addChild(space.getCircle());
            }
        }

        // Add the offboard spaces (not drawn).
        self.offBoard.out1 = new Space("out1", 5*boardSpacing, 0);
        self.offBoard.out2 = new Space("out2", 7*boardSpacing, 0);
        self.offBoard.out3 = new Space("out3", 9*boardSpacing, 0);
        self.offBoard.out4 = new Space("out4", 11*boardSpacing, 0);
        self.offBoard.out5 = new Space("out5", 13*boardSpacing, 0);
        self.offBoard.out6 = new Space("out6", 15*boardSpacing, 0);
        self.offBoard.out7 = new Space("out7", 4*boardSpacing, yOffset);
        self.offBoard.out8 = new Space("out8", 16*boardSpacing, yOffset);
        self.offBoard.out9 = new Space("out9", 3*boardSpacing, 2*yOffset);
        self.offBoard.out10 = new Space("out10", 17*boardSpacing, 2*yOffset);
        self.offBoard.out11 = new Space("out11", 2*boardSpacing, 3*yOffset);
        self.offBoard.out12 = new Space("out12", 18*boardSpacing, 3*yOffset);
        self.offBoard.out13 = new Space("out13", boardSpacing, 4*yOffset);
        self.offBoard.out14 = new Space("out14", 19*boardSpacing, 4*yOffset);
        self.offBoard.out15 = new Space("out15", 0, 5*yOffset);
        self.offBoard.out16 = new Space("out16", 20*boardSpacing, 5*yOffset);
        self.offBoard.out17 = new Space("out17", boardSpacing, 6*yOffset);
        self.offBoard.out18 = new Space("out18", 19*boardSpacing, 6*yOffset);
        self.offBoard.out19 = new Space("out19", 2*boardSpacing, 7*yOffset);
        self.offBoard.out20 = new Space("out20", 18*boardSpacing, 7*yOffset);
        self.offBoard.out21 = new Space("out21", 3*boardSpacing, 8*yOffset);
        self.offBoard.out22 = new Space("out22", 17*boardSpacing, 8*yOffset);
        self.offBoard.out23 = new Space("out23", 4*boardSpacing, 9*yOffset);
        self.offBoard.out24 = new Space("out24", 16*boardSpacing, 9*yOffset);
        self.offBoard.out25 = new Space("out25", 5*boardSpacing, 10*yOffset);
        self.offBoard.out26 = new Space("out26", 7*boardSpacing, 10*yOffset);
        self.offBoard.out27 = new Space("out27", 9*boardSpacing, 10*yOffset);
        self.offBoard.out28 = new Space("out28", 11*boardSpacing, 10*yOffset);
        self.offBoard.out29 = new Space("out29", 13*boardSpacing, 10*yOffset);
        self.offBoard.out30 = new Space("out30", 15*boardSpacing, 10*yOffset);

        for (let offBoardId in self.offBoard) {
            if (self.offBoard.hasOwnProperty(offBoardId)) {
                let offBoard = self.offBoard[offBoardId];
                self.stage.addChild(offBoard.getCircle());
            }
        }

        self.createLines();

        // Add the marbles
        for (let spaceId in self.gameState.board) {
            if (self.gameState.board.hasOwnProperty(spaceId)) {
                let player = self.gameState.board[spaceId];
                if (player < 0 || player > 2) {
                    throw "Invalid player number found in space " + spaceId.getId() + ": " + player;
                }
                if (player !== 0) {
                    let marble = new Marble(self.spaces[spaceId], player, self.dragMarble, self.releaseMarble, self.pressMarble);
                    self.spaces[spaceId].setMarble(marble);

                    self.stage.addChild(marble.getCircle());
                }
            }
        }

        self.stage.update();
    };

    this.setupGame = function (gameState) {
        self.gameState = gameState;

        self.visibleSection(Constants.sections.game);

        self.createBoard();

        window.onresize = self.configureWindow;
        self.configureWindow();

        if (gameState.player1.name === sessionStorage.name) {
            self.myNumber = 1;
            self.isMyTurn = true;
        } else {
            self.myNumber = 2;
            self.isMyTurn = false;
            Requests.makeMove(self.gameState.id, new Array(), self.updateStateFromRemote, self.handleError);
        }

        self.finished = false;
    };

    this.loadGame = function (gameId) {
        if (gameId !== null) {
            Requests.loadGame(gameId, self.setupGame, self.handleError);
        } else {
            self.goToLobby();
        }
    };

    /* MOUSE HANDLERS */
    this.isMyTurn = true;
    this.currentMarble = null;
    this.draggingToSpace = null;
    this.draggedFromX = 0;
    this.draggedFromY = 0;
    this.dragged = false;
    this.finished = false;
    this.isAlreadySelected = false;
    this.isValidDrag = true;
    this.isValidated = false;

    this.pressMarble = function (marble, event) {
        if (self.isMyTurn) {
            self.dragged = false;
            self.isAlreadySelected = false;
            if (!self.finished) {
                self.draggingToSpace = null;
                self.currentMarble = null;
                self.draggedFromX = event.stageX / self.isoScale;
                self.draggedFromY = event.stageY / self.isoScale;
                if (self.selectedMarbles.indexOf(marble) > -1) {
                    // Clicking or dragging a selected marble
                    self.currentMarble = marble;
                    self.isAlreadySelected = true;
                } else {
                    // Clicking or dragging a non-selected marble
                    self.isAlreadySelected = false;
                    if (self.gameState.currentPlayer === marble.getPlayer()) {
                        // User clicked on their own marble.
                        self.currentMarble = marble;
                        if (self.selectedMarbles.length > 0) {
                            //Get lines which marble is on.
                            let onLines = self.getLinesForSpace(marble.getSpace());
                            if (self.selectedMarbles.length === 3) {
                                // 3 marbles already selected.  Deselect all
                                self.selectedMarbles.forEach(marble => marble.deselect());
                                self.selectedMarbles = [];
                            } else if (self.selectedMarbles.length === 2) {
                                // 2 marbles already selected.  Is selected marble inline?
                                // Get line which selected marbles are on.
                                let selectedLine = self.getLineForSpaces(self.selectedMarbles[0].getSpace(), self.selectedMarbles[1].getSpace());
                                if (onLines.indexOf(selectedLine) === -1) {
                                    // Current marble is not in-line with selected marbles.
                                    self.selectedMarbles.forEach(marble => marble.deselect());
                                    self.selectedMarbles = [];
                                } else {
                                    // Check whether the marble is a neighbour and inline with both selected marbles
                                    let i0 = selectedLine.indexOf(self.selectedMarbles[0].getSpace());
                                    let i1 = selectedLine.indexOf(self.selectedMarbles[1].getSpace());
                                    if ((selectedLine[i0 - 1] === null || selectedLine[i0 - 1].getId() !== marble.getSpace().getId())
                                        && (selectedLine[i0 + 1] === null || selectedLine[i0 + 1].getId() !== marble.getSpace().getId())
                                        && (selectedLine[i1 - 1] === null || selectedLine[i1 - 1].getId() !== marble.getSpace().getId())
                                        && (selectedLine[i1 + 1] === null || selectedLine[i1 + 1].getId() !== marble.getSpace().getId())) {
                                        self.selectedMarbles.forEach(marble => marble.deselect());
                                        self.selectedMarbles = [];
                                    }
                                }
                            } else if (self.selectedMarbles.length === 1) {
                                // Only 1 marble already selected. Is selected marble a neighbour?
                                let isNeighbour = function (i) {
                                    let line = onLines[i];
                                    let index = line.indexOf(marble.getSpace());
                                    let prev = line[index - 1];
                                    let next = line[index + 1];
                                    return (prev != null && prev.getId() === self.selectedMarbles[0].getSpace().getId()) ||
                                        (next != null && next.getId() === self.selectedMarbles[0].getSpace().getId());

                                };
                                if (!isNeighbour(0) && !isNeighbour(1) && !isNeighbour(2)) {
                                    self.selectedMarbles.forEach(marble => marble.deselect());
                                    self.selectedMarbles = [];
                                }
                            }
                        }
                    }
                }
            }
            if (!self.isAlreadySelected && self.currentMarble) {
                self.addSelectedMarble(self.currentMarble);
            }
            self.isValidDrag = true;
            self.isValidated = false;
        }
    };

    this.releaseMarble = function (marble, event) {
        if (!self.dragged) { // Have clicked a marble
            if (self.isAlreadySelected && self.selectedMarbles.indexOf(marble) > -1) {
                if (self.selectedMarbles.length < 3 || self.selectedMarbles[2] === marble) {
                    self.removeSelectedMarble(marble);
                } else { // Do not deselect only middle marble.
                    let line = null;
                    if (self.currentMarble) {
                        line = self.getLineForSpaces(self.selectedMarbles[0].getSpace(), self.selectedMarbles[1].getSpace());
                    }
                    let indices = [];
                    indices.push(line.indexOf(self.selectedMarbles[0].getSpace()));
                    indices.push(line.indexOf(self.selectedMarbles[1].getSpace()));
                    indices.push(line.indexOf(self.selectedMarbles[2].getSpace()));
                    indices.sort();
                    let currentIndex = line.indexOf(self.currentMarble.getSpace());
                    if (indices[1] !== currentIndex) { // Marble is at either end of the row, so deselect.
                        self.removeSelectedMarble(self.currentMarble);
                    }
                }
            } else {
                self.dragged = false;
            }
        } else if (self.isValidDrag && self.draggingToSpace) {// Have dragged a marble.
            if(self.isMyTurn && !self.finished) {
                let currentX = marble.getSpace().getX();
                let currentY = marble.getSpace().getY();
                let targetX = self.draggingToSpace.getX();
                let targetY = self.draggingToSpace.getY();
                let minChangeX = Math.abs(targetX - currentX) / 2;
                let minChangeY = Math.abs(targetY - currentY) / 2;
                let dropPointX = event.stageX / self.isoScale;
                let dropPointY = event.stageY / self.isoScale;
                let xChange = Math.abs(dropPointX - currentX);
                let yChange = Math.abs(dropPointY - currentY);
                if (xChange < minChangeX || yChange < minChangeY) {
                    // Marble wasn't dragged far enough from its starting point.
                    self.resetMarbles();
                } else {
                    // Identify the new space for each moving marble
                    let moves = [];

                    let addMove = function (marble) {
                        //console.log("addMove called on marble at " + marble.getSpace().getId());
                        let neighbours = self.getNeighbourSpaces(marble);
                        let targetSpace = self.moveMarbleTo(marble, neighbours, minChangeX, minChangeY);
                        //console.log("neighbours: ", neighbours.toString());
                        //console.log("targetSpace: ", targetSpace);
                        let move = {};
                        move.from = marble.getSpace().getId();
                        move.to = targetSpace.getId();
                        moves.push(move);
                        if (targetSpace.isOffBoard()) {
                            //console.log("Gone to offboard? " + targetSpace.getId());
                            marble.remove();
                            self.stage.removeChild(marble.getCircle());
                        } else {
                            //console.log("Player " + marble.getPlayer() + ": " + marble.getSpace().getId() + " -> " + targetSpace.getId());
                            if(marble.getSpace().getMarble() === marble) {
                                marble.getSpace().setMarble(null);
                            }
                            marble.setSpace(targetSpace);
                            targetSpace.setMarble(marble);
                        }
                        marble.deselect();
                        /*return true;*/
                    };
                    try {
                        addMove(self.selectedMarbles[0]);
                        addMove(self.selectedMarbles[1]);
                        addMove(self.selectedMarbles[2]);
                    } catch (lessThanThreeSelected) {
                        //console.log("less than three selected");
                    }
                    self.selectedMarbles = [];
                    try {
                        addMove(self.pushedMarbles[0]);
                        addMove(self.pushedMarbles[1]);
                    } catch (lessThanTwoPushed) {
                        //console.log("Less than two pushed");
                    }
                    self.pushedMarbles = [];

                    // Notify the backend player controller.
                    self.updateState(moves);

                    Requests.makeMove(self.gameState.id, moves, self.updateStateFromRemote, self.handleError);

                    if (self.isGameOver()) {
                        self.endGame();
                    }
                }
                self.dragged = false;
                self.stage.update();
            }
        }
    };

    this.dragMarble = function (marble, event) {
        if(self.isMyTurn && !self.finished && self.currentMarble) {
            self.dragged = true;
            // Convert physical drag dimensions to marble's abstract dimensions.
            let draggedToX = event.stageX / self.isoScale;
            let draggedToY = event.stageY / self.isoScale;
            let xMove = draggedToX - self.draggedFromX;
            let yMove = draggedToY - self.draggedFromY;
            marble.move(xMove, yMove);
            // Correct xMove and yMove to fit line.
            let targetSpace = self.draggingMarbleTo(marble, self.getNeighbourSpaces(marble));
            let diffX = targetSpace.getX() - marble.getSpace().getX();
            let diffY = targetSpace.getY() - marble.getSpace().getY();
            yMove = (diffY * Math.abs(xMove)) / Math.abs(diffX);
            // Limit x- and y-moves to no more than 1 space.
            if (Math.abs(yMove) > Constants.yOffset) {
                let ySign = yMove / Math.abs(yMove);
                yMove = ySign * Constants.yOffset;
                if (Math.abs(xMove) > Constants.halfBoardSpacing) {
                    let xSign = xMove / Math.abs(xMove);
                    xMove = xSign * Constants.halfBoardSpacing;
                }
            } else if (Math.abs(xMove) > Constants.fullBoardSpacing) {
                let xSign = xMove / Math.abs(xMove);
                xMove = xSign * Constants.fullBoardSpacing;
            }

            // Move the marbles now. The must be moved so the next section can identify
            // whether all the moved marbles are valid or not.
            self.moveSelectedMarbles(xMove, yMove);
            self.movePushedMarbles(xMove, yMove);

            // Identify globally, which neighbour the marble is being dragged to.
            // But only once the marble is moved a certain distance.
            // This avoids confusion with initial mouse juddering.
            if (!self.draggingToSpace && (Math.abs(xMove) > Constants.minXMove || Math.abs(yMove) > Constants.minYMove) ) {
                self.draggingToSpace = targetSpace;
            } else if (self.draggingToSpace && self.draggingToSpace !== targetSpace){
                self.isValidDrag = false;
                self.isValidated = false;
                self.draggingToSpace = null;
                self.resetMarbles();
            }

            if (targetSpace.isOffBoard()) {
                // Dragging to an offboard space isn't allowed.
                self.isValidDrag = false;
            } else if (self.isValidDrag && self.draggingToSpace && !self.isValidated) {
                /*//console.log("Validating move.");*/
                self.isValidated = true;
                // Find line which current marble is being dragged on.
                let line = self.getLineForSpaces(self.currentMarble.getSpace(), targetSpace);
                // Are the selected marbles being dragged in-line?
                let inline = true;
                if (self.selectedMarbles.length === 1) {
                    inline = false; // Only a single marble.
                } else {
                    if (line.indexOf(self.selectedMarbles[0].getSpace()) === -1
                        || line.indexOf(self.selectedMarbles[1].getSpace()) === -1) {
                        inline = false; // If draggine marles inline, all 3 marbles will be in the same line
                    }
                }
                // Get direction that the marble is being dragged.
                let direction = line.indexOf(targetSpace) - line.indexOf(self.currentMarble.getSpace());
                if (inline) { // Drag in-line.
                    for (let i = 0; i < self.selectedMarbles.length; i++) {
                        let thisMarble = self.selectedMarbles[i];
                        let nextIndex = line.indexOf(thisMarble.getSpace()) + direction;
                        let pushSpace = line[nextIndex];
                        // Marble can't be pushed out.
                        if (pushSpace.isOffBoard()) {
                            self.isValidDrag = false;
                            break;
                        }
                        // Identify if marbles are being pushed.
                        let pushMarble = pushSpace.getMarble();
                        if (pushMarble === null) {
                            self.resetPushed();
                            break;
                        } else {
                            if (pushMarble.getPlayer() === self.currentMarble.getPlayer()) {
                                // Don't move to space occupied by own unselected marble.
                                if (self.selectedMarbles.indexOf(pushMarble) === -1) {
                                    self.isValidDrag = false;
                                    break;
                                }
                            } else {
                                if(self.pushedMarbles.length > 0) {
                                    // Clear pushed marbles if push direction changed.
                                    let pushIndex = line.indexOf(pushMarble.getSpace());
                                    let heldIndex = line.indexOf(self.pushedMarbles[0].getSpace());
                                    if (pushIndex > (heldIndex + 1) || pushIndex < (heldIndex - 1)){
                                        self.resetPushed();
                                    }
                                }
                                // Push opponent's marbles if less in-line.
                                self.addPushedMarble(pushMarble);
                                nextIndex += direction;
                                pushSpace = line[nextIndex];
                                if (pushSpace !== null) {
                                    pushMarble = pushSpace.getMarble();
                                } else {
                                    pushMarble = null;
                                }
                                if (pushMarble !== null) {
                                    if (self.selectedMarbles.length === 2 || pushMarble.getPlayer() === self.gameState.currentPlayer) {
                                        // 2 marbles can't push if 2 opponent marbles or single marble blocked by own piece.
                                        self.isValidDrag = false;
                                        self.resetPushed();
                                        break;
                                    } else {
                                        self.addPushedMarble(pushMarble);
                                        nextIndex = line.indexOf(pushSpace) + direction;
                                        pushSpace = line[nextIndex];
                                        if (pushSpace !== null) {
                                            pushMarble = pushSpace.getMarble();
                                        } else {
                                            pushMarble = null;
                                        }
                                        if (pushMarble !== null) {
                                            // Either 3 opponent marbles or 2 blocked by own marble.
                                            self.isValidDrag = false;
                                            self.resetPushed();
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else { // Not inline.
                    self.resetPushed();
                    let checkMove = function (marble) {
                        // Identify which neighbour the marble is being dragged to.
                        targetSpace = self.draggingMarbleTo(marble, self.getNeighbourSpaces(marble));
                        // Identify if the marble is moving to a valid space.
                        if (targetSpace.isOffBoard() || targetSpace.getMarble() !== null) {
                            self.isValidDrag = false;   // Single marble or Side-step can't push any other marble.
                        }
                    };
                    try {
                        checkMove(self.selectedMarbles[0]);
                        checkMove(self.selectedMarbles[1]);
                        checkMove(self.selectedMarbles[2]);
                    } catch (lessThanThreeMarblesSelected) {
                        //console.log("less than three selected");
                    }
                }
            }

            if (!self.isValidDrag) {
                self.resetMarbles();
            }

            self.stage.update();
        }
    };

    this.draggingMarbleTo = function (marble, spaces) {
        let closest = marble.getSpace();   // Initialise with marble's current space.
        let distance = Constants.fullBoardSpacing; // Initialise with maximum possible distance from neighbour space.
        let checkIfClosest = function (space) {
            let xDistance = Math.abs(space.getX() - marble.getX());
            let yDistance = Math.abs(space.getY() - marble.getY());
            let dist = Math.sqrt((xDistance*xDistance) + (yDistance*yDistance));
            if(dist <= distance){
                distance = dist;
                closest = space;
            }
        };
        try {
            checkIfClosest(spaces[0]);
            checkIfClosest(spaces[1]);
            checkIfClosest(spaces[2]);
            checkIfClosest(spaces[3]);
            checkIfClosest(spaces[4]);
            checkIfClosest(spaces[5]);
        } catch (lessThanSixSpaces) {
            // Ignore it
        }
        return closest;
    };

    this.moveMarbleTo = function (marble, spaces, xMidPoint, yMidPoint) {
        let canMoveTo = function (space) {
            let xDistance = Math.abs(space.getX() - marble.getX());
            let yDistance = Math.abs(space.getY() - marble.getY());
            if(xDistance <= xMidPoint && yDistance <= yMidPoint){
                return space;
            }
            return false;
        };
        return canMoveTo(spaces[0]) || canMoveTo(spaces[1]) || canMoveTo(spaces[2]) || canMoveTo(spaces[3]) || canMoveTo(spaces[4]) || canMoveTo(spaces[5]);
    };

    this.resetMarbles = function () {
        for(let i = 0; i < self.selectedMarbles.length; i++) {
            let marble = self.selectedMarbles[i];
            marble.setPos(marble.getSpace().getX(), marble.getSpace().getY());
        }
        self.drawSelectedMarbles();
        self.resetPushed();
    };

    this.resetPushed = function () {
        for(let i = 0; i < self.pushedMarbles.length; i++) {
            let marble = self.pushedMarbles[i];
            marble.setPos(marble.getSpace().getX(), marble.getSpace().getY());
        }
        self.pushedMarbles = [];
    };

    /* MOVE COMPLETION HANDLERS */

    this.updateState = function (moves) {
        // Update game state with move
        let marbles = [];
        // Clear the spaces previously occupied by each marble.
        moves.forEach(move => {
            marbles.push( self.gameState.board[move.from] );
            self.gameState.board[move.from] = 0;
        });
        // Now set the moved marbles to their new spaces.
        moves.forEach(move => {
            if (self.offBoard[move.to] !== undefined) {
                // When marble pushed off, increment the other player's score and strength.
                let pushedOutPlayer = marbles.shift();
                if(pushedOutPlayer === 1) {
                    self.player2Score = (self.gameState.player2.score++).toString();
                } else if(pushedOutPlayer === 2) {
                    self.player1Score = (self.gameState.player1.score++).toString();
                }
            } else {
                // Put marble in its new space.
                self.gameState.board[move.to] = marbles.shift();
            }
        });
        console.log(self.gameState.board);

        if (self.gameState.currentPlayer === 1) {
            self.gameState.currentPlayer = 2;
        } else if (self.gameState.currentPlayer === 2) {
            self.gameState.currentPlayer = 1;
        }

        self.isMyTurn = self.myNumber === self.gameState.currentPlayer;

        if (self.gameState.player1.score === 6) {
            self.gameState.winner = 1;
        } else if (self.gameState.player2.score === 6) {
            self.gameState.winner = 2;
        }
    };

    this.updateStateFromRemote = function (movesDto, gameStateHash) {
        // TODO Validate GameState matches our GameState.
        self.animateMove(movesDto.moves);
        self.updateState(movesDto.moves);
        self.isMyTurn = true;
        if (self.isGameOver()) {
            self.endGame();
        }
    };

    this.animateMove = function (moves) {
        let movingMarbles = [];
        let from = [];
        let to = [];
        moves.forEach(marbleMove => {
            for (let spaceId in self.spaces) {
                if (spaceId === marbleMove.from) {
                    let space = self.spaces[spaceId];
                    movingMarbles.push(space.marble);
                    from.push(space);
                    break; // No need to continue searching spaces.
                }
            }
        });
        moves.forEach(marbleMove => {
            let spaces = {};
            if ( marbleMove.to.startsWith("out") ) {
                spaces = self.offBoard;
            } else {
                spaces = self.spaces;
            }
            for (let spaceId in spaces) {
                if (spaceId === marbleMove.to) {
                    to.push(spaces[spaceId]);
                    break; // No need to continue searching spaces.
                }
            }
        });

        let xChange = (to[0].getX() - from[0].getX())/30;
        let yChange = (to[0].getY() - from[0].getY())/30;

        // Move the marbles
        let count = 0;
        let timer = window.setInterval(function () {
            if (count === 30) {
                movingMarbles.forEach(function (marble, i) {
                    marble.setPos( to[i].getX(), to[i].getY() );
                    if(marble.getSpace().getMarble() === marble) {
                        marble.getSpace().setMarble(null);
                    }
                    if (to[i].isOffBoard()) {
                        self.stage.removeChild(marble.getCircle());
                    } else {
                        marble.setSpace(to[i]);
                        to[i].setMarble(marble);
                    }
                });
                window.clearInterval(timer);
            } else {
                movingMarbles.forEach(marble => marble.animate(xChange, yChange));
                count++;
            }
            self.stage.update();
        }, 30 );
    };

    this.isGameOver = function () {
        return self.gameState.winner !== 0;
    };

    /* INIT */
    this.handleError = function (error) {
        // TODO Something better
        console.log("handleError", JSON.stringify(error));
        self.goToLogin();
    };

    this.init = ko.computed(function () {
        if (sessionStorage.token && sessionStorage.name) {
            self.username(sessionStorage.name);
            self.completeLogin(sessionStorage.token);
        } else {
            self.goToLogin();
        }
    });
}

ko.applyBindings(new AbaloneViewModel());