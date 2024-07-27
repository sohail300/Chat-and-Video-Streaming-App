import express from "express";
import WebSocket, { WebSocketServer } from "ws";

const app = express();

const httpServer = app.listen(8085, () => {
  console.log("Server listening on port 8085");
});

const wss = new WebSocketServer({ server: httpServer });

let senderSocket: WebSocket | null = null;
let receiverSocket: WebSocket | null = null;

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data: string) => {
    const message = JSON.parse(data);
    switch (message.type) {
      case "sender":
        senderSocket = ws;
        console.log("sender");
        break;
      case "receiver":
        receiverSocket = ws;
        console.log("receiver");
        break;
      case "createOffer":
        if (ws !== senderSocket) {
          return;
        }
        console.log("createOffer");
        receiverSocket?.send(
          JSON.stringify({ type: "createOffer", sdp: message.sdp })
        );
        break;
      case "createAnswer":
        if (ws !== receiverSocket) {
          return;
        }
        console.log("createAnswer");
        senderSocket?.send(
          JSON.stringify({ type: "createAnswer", sdp: message.sdp })
        );
        break;
      case "iceCandidate":
        console.log("iceCandidate");
        if (ws === receiverSocket) {
          senderSocket?.send(
            JSON.stringify({
              type: "iceCandidate",
              candidate: message.candidate,
            })
          );
        }
        if (ws === senderSocket) {
          receiverSocket?.send(
            JSON.stringify({
              type: "iceCandidate",
              candidate: message.candidate,
            })
          );
        }
        break;
      default:
        break;
    }
  });
});
