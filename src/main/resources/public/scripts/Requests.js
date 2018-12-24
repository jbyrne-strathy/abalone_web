var Requests = {
    joinLobby: function (successHandler, errorHandler) {
        $.get({
            url: "/lobby/joinLobby",
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLobbyUpdate: function (successHandler, errorHandler) {
        $.get({
            url: "/lobby/getLobbyUpdates",
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLeaderboard: function (successHandler, errorHandler) {
        $.get({
            url: "/lobby/getLeaderboard",
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLeaderboardUpdates: function (successHandler, errorHandler) {
        $.get({
            url: "/lobby/getLeaderboardUpdates",
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
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
            url: "/lobby/leaveLobby",
            headers: {Authorization: "Bearer " + sessionStorage.token},
            data: {}
        })
    },
    sendChallenge: function (target, successHandler, errorHandler) {
        $.ajax({
            method: "post",
            url: "/lobby/sendChallenge",
            headers: {Authorization: "Bearer " + sessionStorage.token},
            data: {challengedPlayer: target}
        }).then(successHandler, errorHandler);
    },
    answerChallenge: function (isAccepted, successHandler, errorHandler) {
        $.ajax({
            method: "post",
            url: "/lobby/answerChallenge",
            headers: {Authorization: "Bearer " + sessionStorage.token},
            data: {isAccepted: isAccepted}
        }).then(successHandler, errorHandler);
    },
    loadGame: function (gameId, successHandler, errorHandler) {
        $.get({
            url: "/game/loadGame?id=" + gameId,
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    }
}