"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub3").build();

connection.on("ReceiveMessage3", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var div = document.createElement("div");
    div.className = "message";
    var text_user = document.createElement("p");
    var text_message = document.createElement("p");
    text_user.textContent = user;
    text_message.textContent = msg;
    text_user.className = "message-text-user";
    text_message.className = "message-text-message";
    div.appendChild(text_user);
    div.appendChild(text_message);
    document.getElementById("messagesListRoom3").insertAdjacentElement('afterbegin', div);

});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButtonRoom3").addEventListener("click", function (event) {
    var user = document.getElementById("userInputRoom3").value;
    var message = document.getElementById("messageInputRoom3").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});