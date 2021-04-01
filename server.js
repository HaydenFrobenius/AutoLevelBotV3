const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

const PORT = process.env.PORT || 3000;
const INDEX = './index.html';

const server = express()
    .use(express.static(path.join(__dirname, './')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
const Discord = require('selfbot-discord.js');

const clients = {}

io.on('connection', (socket) => {
    console.log("New user connected!");

    socket.emit('clientConnection');

    socket.on('startBot', (token, channelID, msg) => {
        // Token recieved! Lets try to use it c:

        if (msg.length > 2000) {
            socket.emit('changeResult',"That message is too big! It must be 2000 characters or less.");
            return;
        }

        clients[token] = new Discord.Client();

        client = clients[token];

        client.on('ready', () => {
            // Client is ready!

            var channel = client.channels.get(channelID);

            if (channel == null) {
                socket.emit('changeResult',"Invalid channel ID!");
                client = clients[token];

                if (client != null) {
                    client.destroy();
                    clients[token] = null;
                    client = null;
                } else {
                    console.log("Error while finding client.");
                }
            } else {
                socket.emit('validToken', token);

                var intervalVar = setInterval(sendMessage, 3000);

                function sendMessage() {
                    if (clients[token] != null) {
                        channel.send(String(msg));
                    } else {
                        clearInterval(intervalVar);
                    }
                }
            }
        });

        client.login(token).then(() => {
            // Token is valid! c:
        }).catch((err) => {
            // Token is invalid. :c

            socket.emit('invalidToken');

            clients[token] = null;
            client = null;
        });
    });

    socket.on('endBot', (token) => {
        client = clients[token];

        if (client != null) {
            client.destroy();
            clients[token] = null;
            client = null;
        } else {
            console.log("Error while finding client.");
        }
    });

    socket.on('forceEndBot', (token) => {
        client = clients[token];

        if (client != null) {
            client.destroy();
            clients[token] = null;
            client = null;
            socket.emit('changeResultFQ',"Successfully ended AutoLevelBot V3.");
        } else {
            console.log("Error while finding client.");
        }
    });
})