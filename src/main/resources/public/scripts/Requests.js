const Requests = {
    login: function (username, password, successHandler, errorHandler) {
        $.post("/login", {username: username, password: password})
            .then(successHandler, errorHandler);
    },
    createAccount: function (username, password, successHandler, errorHandler) {
        $.post("/createAccount", {username: username, password: password})
            .then(successHandler, errorHandler);
    },
    leaveLobby: function () {
        $.ajax({
            method: "post",
            url: "/game/leaveLobby",
            headers: {Authorization: "Bearer " + sessionStorage.token},
            data: {}
        })
    },
    joinLobby: function (successHandler, errorHandler) {
        $.get({
            url: "/game/joinLobby",
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLobbyUpdate: function (successHandler, errorHandler) {
        $.get({
            url: "/game/getLobbyUpdates",
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLeaderboard: function (successHandler, errorHandler) {
        $.get({
            url: "/game/getLeaderboard",
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLeaderboardUpdates: function (successHandler, errorHandler) {
        $.get({
            url: "/game/getLeaderboardUpdates",
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    sendChallenge: function (target, successHandler, errorHandler) {
        $.ajax({
            method: "post",
            url: "/game/sendChallenge",
            headers: {Authorization: "Bearer " + sessionStorage.token},
            data: {challengedPlayer: target}
        }).then(successHandler, errorHandler);
    },
    answerChallenge: function (isAccepted, successHandler, errorHandler) {
        $.ajax({
            method: "post",
            url: "/game/answerChallenge",
            headers: {Authorization: "Bearer " + sessionStorage.token},
            data: {isAccepted: isAccepted}
        }).then(successHandler, errorHandler);
    },
    loadGame: function (gameId, successHandler, errorHandler) {
        $.get({
            url: "/game/loadGame?id=" + gameId,
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    makeMove: function (gameId, moves, successHandler, errorHandler) {
        $.ajax({
            method: "post",
            url: "/game/makeMove",
            headers: {Authorization: "Bearer " + sessionStorage.token},
            contentType: "application/json",
            data: JSON.stringify({
                gameId: gameId,
                moves: moves
            })
        }).then(successHandler, errorHandler);
    }
};