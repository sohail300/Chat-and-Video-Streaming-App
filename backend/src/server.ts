import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import { Message } from "./types/interfaces";
import { v4 as uuidv4 } from "uuid";

const app = express();

const httpServer = app.listen(8080, () => {
  console.log("Server listening on port 8080");
});

const id = uuidv4();

let connections = 0;

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", function (ws) {
  connections++;
  const newMessage: Message = {
    id,
    text: "Welcome to chat!",
    sender: "Server",
    connections,
  };
  ws.send(JSON.stringify(newMessage));

  ws.on("message", (data: string, isBinary) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const JSONdata = JSON.parse(data);
        const newData = { ...JSONdata, connections };
        client.send(JSON.stringify(newData), { binary: isBinary });
      }
    });
  });

  ws.on("error", console.error);

  ws.on("close", () => {
    connections--;
  });
});
