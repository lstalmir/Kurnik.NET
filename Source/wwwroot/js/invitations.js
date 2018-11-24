"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/invitationHub").build();

connection.on("HandleInvitation", function (invitation) {
    console.log(invitation);

});

connection.start().catch(function (err) {
    return console.error(err.toString());
});