window.onload = function() {
    var socket = io();

    var toggleBotButton = document.getElementById('toggleBot');

    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    // Check if "isRunning" exists in LocalStorage and if it doesn't set it to false.

    let isRunning = localStorage.getItem('isRunning');

    if (isRunning == null) {
        localStorage.setItem('isRunning', false);
    }

    function result(result) {
        var resultText = document.getElementById('resultText');

        resultText.textContent = result;
        console.log(result);
    }

    toggleBotButton.addEventListener("click", evt => {
        var discordToken = document.getElementById('token').value;
        var channelID = document.getElementById('channelID').value;
        var message = document.getElementById('message').value;

        var isRunning = localStorage.getItem('isRunning');

        if (isRunning == "false" || isRunning == false) {
            // App is not started yet, lets start it.

            if (discordToken == "" || discordToken == " " || discordToken == null) {
                // No token provided, lets return.
        
                result("No token provided.");
            } else {
                // Token provided!

                /*if (message.length > 2000) {
                    result("That message is too big! It must be 2000 characters or less.");
                } else {
                    socket.emit('startBot', discordToken,channelID,message);
                }*/

                socket.emit('startBot', discordToken,channelID,message);
                result("Starting bot...");
            }
        } else {
            // App is already started, lets end it.

            var setDiscordToken = localStorage.getItem('token');

            socket.emit('endBot', setDiscordToken);

            localStorage.removeItem('token');
            localStorage.setItem('isRunning', false);
            toggleBotButton.textContent = "Start AutoLevelBot V3"
            result("Successfully ended AutoLevelBot V3.");
        }
    })

    socket.on('invalidToken', () => {
        // Token is invalid :c

        result("An invalid token has been provided.");
    })

    socket.on('validToken', (token) => {
        // Token is valid c:

        result("Successfully started AutoLevelBot V3!");

        localStorage.setItem('token', token);
        localStorage.setItem('isRunning', true);
        toggleBotButton.textContent = "Stop AutoLevelBot V3"
    })

    socket.on('changeResult', async (resultOutput) => {
        await sleep(0050);
        result(resultOutput);
    })

    socket.on('clientConnection', async () => {
        let isRunning = localStorage.getItem('isRunning');

        if (isRunning == true || isRunning == "true") {
            toggleBotButton.textContent = "Stop AutoLevelBot V3";
        }
    })
}