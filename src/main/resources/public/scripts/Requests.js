var Requests = {
    getLobby: function (successHandler, errorHandler) {
        $.getJSON("/rest/getLobby", {}, successHandler, errorHandler);
    },
    getLobbyUpdate: function (successHandler, errorHandler) {
        $.getJSON("/rest/getLobbyUpdates", {}, successHandler, errorHandler);
    }
}