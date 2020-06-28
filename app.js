const dotenv = require("dotenv");
const tmi = require("tmi.js");
const WebSocket = require("ws");

dotenv.config();
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  const client = new tmi.Client({
    options: { debug: true },
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      username: "stackit_bot",
      password: process.env.TWITCH_PASSWORD,
    },
    channels: ["brookzerker"],
  });

  client.connect();

  client.on("message", (channel, tags, message, self) => {
    if (self) return;

    if (message.toLowerCase() == "#drop") {
      ws.send("drop");
    }
  });
});
