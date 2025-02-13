import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    //declaration
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        //this.player1 refers to the instance variable (declared earlier)
        // player1 (the parameter) gets assigned to the instance variable
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"

            }
        }))


    }

    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
    }) {
        if (this.board.history().length % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.board.history().length % 2 === 1 && socket !== this.player2) {
            return;
        }

        console.log("didnot early return");
        try {
            //sockets board changes, we need to emit to other one
            this.board.move(move);

        } catch (e) {
            console.log(e)
            return;

        }
        console.log("move succeded")

        //check if the game is over
        if (this.board.isGameOver()) {
            //this is how we send a message in websockets from the server
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));

            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? "black" : "white"
                }
            }));
            return;
        }
        console.log("game is not over yet")
        //if the game is not over we need to emit the move to the other player
        if (this.board.history().length % 2 === 1) {
            console.log("player 2 shoulf get the emit")
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
            console.log("player 2 did get the emit")
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
            console.log("player1 gets the emit")

        }



        //send the updated board to both the users
    }
}

//add time logic