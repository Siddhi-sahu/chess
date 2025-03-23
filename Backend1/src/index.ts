//ws server

//todo: clear interval

import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const PORT = process.env.PORT || "8080";

const wss = new WebSocketServer({ port: parseInt(PORT) });

const gameManager = new GameManager();

wss.on("connection", function connection(ws) {
    gameManager.addUser(ws);

    ws.on("disconnect", () => gameManager.removeUser(ws));
})