var Requests = {
    getLobby: function (token, successHandler, errorHandler) {
        $.get({
            url: "/rest/getLobby",
            headers: {accessToken: sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLobbyUpdate: function (token, successHandler, errorHandler) {
        $.get({
            url: "/rest/getLobbyUpdates",
            headers: {accessToken: sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLeaderboard: function (token, successHandler, errorHandler) {
        $.get({
            url: "/rest/getLeaderboard",
            headers: {accessToken: sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    getLeaderboardUpdates: function (token, successHandler, errorHandler) {
        $.get({
            url: "/rest/getLeaderboardUpdates",
            headers: {accessToken: sessionStorage.token}
        }).then(successHandler, errorHandler);
    },
    login: function (username, password, successHandler, errorHandler) {
        $.post("/login", {username: username, password: password})
            .then(successHandler, errorHandler);
    },
    createAccount: function (username, password, successHandler, errorHandler) {
        $.post("/createAccount", {username: username, password: password})
            .then(successHandler, errorHandler);
    }
}