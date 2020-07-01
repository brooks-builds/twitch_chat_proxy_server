const dotenv = require("dotenv");
const tmi = require("tmi.js");
const WebSocket = require("ws");

dotenv.config();
const wss = new WebSocket.Server({ port: 8080 });
let messageCount = 0;
const minimumMessagesBetweenHelpMessages = 50;

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

    messageCount += 1;

    if (messageCount >= minimumMessagesBetweenHelpMessages) {
      sayHelpMessage(client);
    }

    if (message.toLowerCase() == "#drop" || message.toLowerCase() == "!drop") {
      const payload = {
        command: "drop",
        color: tags.color || "no color",
        username: tags.username,
      };
      ws.send(JSON.stringify(payload));
    }
  });

  ws.on("message", (data) => {
    client.say("brookzerker", data);
  });
});

function sayHelpMessage(client) {
  client.say(
    "brookzerker",
    "Play the drop game with the command !help, try to get your box on the platform. List scores with !scores"
  );
}
