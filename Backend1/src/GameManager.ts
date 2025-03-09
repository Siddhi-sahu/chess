import { WebSocket } from "ws";
import { INIT_GAME, MOVE, TIME } from "./messages";
import { Game } from "./Game";

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = []

    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);


    };

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            //JSON.parse() takes a string and converts it into a JavaScript object.
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    //start the game
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = socket;
                }
            }

            if (message.type === MOVE) {
                // console.log("inside move");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    // console.log("inside game")
                    game.makeMove(socket, message.payload.move);
                }
            }


        })
    }
}