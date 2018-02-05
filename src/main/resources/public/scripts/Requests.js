var Requests = {
    joinLobby: function (successHandler, errorHandler) {
        $.get({
            url: "/rest/joinLobby",
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLobbyUpdate: function (successHandler, errorHandler) {
        $.get({
            url: "/rest/getLobbyUpdates",
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLeaderboard: function (successHandler, errorHandler) {
        $.get({
            url: "/rest/getLeaderboard",
            headers: {Authorization: "Bearer " + sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLeaderboardUpdates: function (successHandler, errorHandler) {
        $.get({
            url: "/rest/getLeaderboardUpdates",
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
            method: "postxa",
            url: "/rest/leaveLobby",
            headers: {Authorization: "Bearer " + sessionStorage.token},
            data: {}
        })
    }
}