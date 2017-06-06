﻿$(document).ready(function () {
    // Initialize the PubNub API connection.
    var pubnub = PUBNUB.init({
        publish_key: 'pub-c-27b77e6a-dd37-4fa7-a664-f4d94cc651e5',
        subscribe_key: 'sub-c-65b61bd8-4ad0-11e7-a18e-0619f8945a4f'
    });

    // Grab references for all of our elements.
    var messageContent = $('#messageContent'),
        sendMessageButton = $('#sendMessageButton'),
        messageList = $('#messageList');

    // Handles all the messages coming in from pubnub.subscribe.
    function handleMessage(message) {
        var messageEl = $("<li class='message'>"
            + "<span class='username'>" + message.username + ": </span>"
            + message.text
            + "</li>");
        messageList.append(messageEl);
        messageList.listview('refresh');

        // Scroll to bottom of page
        $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 'slow');
    };

    // Compose and send a message when the user clicks our send message button.
    sendMessageButton.click(function (event) {
        var message = messageContent.val();

        if (message != '') {
            pubnub.publish({
                channel: 'chat',
                message: {
                    username: 'test',
                    text: message
                }
            });

            messageContent.val("");
        }
    });

    // Also send a message when the user hits the enter button in the text area.
    messageContent.bind('keydown', function (event) {
        if ((event.keyCode || event.charCode) !== 13) return true;
        sendMessageButton.click();
        return false;
    });

    // Subscribe to messages coming in from the channel.
    pubnub.subscribe({
        channel: 'chat',
        message: handleMessage
    });
});