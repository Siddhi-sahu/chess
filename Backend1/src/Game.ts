import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { BOARD, GAME_OVER, INIT_GAME, MOVE, TIME } from "./messages";


export class Game {
    //declaration
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    // private startTime: Date;
    public blackTime = 300;
    public whiteTime = 300;

    constructor(player1: WebSocket, player2: WebSocket) {
        //this.player1 refers to the instance variable (declared earlier)
        // player1 (the parameter) gets assigned to the instance variable
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        // this.startTime = new Date();

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "w"
            }
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "b"

            }
        }))


    }

    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
    }) {
        console.log(move);
        if (this.board.history().length % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.board.history().length % 2 === 1 && socket !== this.player2) {
            return;
        }

        console.log("didnot early return");
        try {
            //sockets board changes, we need to emit to other one only if the move succeeded 
            // it doesnt succeed when the square is null
            this.board.move(move);
            // console.log(this.startTime)

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
        // console.log("game is not over yet")
        //if the game is not over we need to emit the move to the other player
        if (this.board.history().length % 2 === 1) {
            // console.log("player 2 shoulf get the emit")
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move

            }));
            // console.log("player 2 did get the emit")
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
            // console.log("player1 gets the emit")

        }



        //send the updated board to both the users

        this.player1.send(JSON.stringify({
            type: BOARD,
            payload: this.board.board()
        }));

        this.player2.send(JSON.stringify({
            type: BOARD,
            payload: this.board.board()
        }));

        // console.log("board from backend", this.board.board());

        //add time logic when the game starts they both have same time, which passes every min if they dont move, when moves the clock stops and other persons clock runs
        //send from backend for the other person because for the user itself we can make the changes in the frontend

        setInterval(() => {
            if (this.board.history().length % 2 === 1) {
                this.whiteTime -= 1;

                this.player2.send(JSON.stringify({
                    type: TIME,
                    payload: this.whiteTime

                }));
                // console.log("player 2 did get the emit")
            } else {
                this.blackTime -= 1;
                this.player1.send(JSON.stringify({
                    type: TIME,
                    payload: this.blackTime
                }));
                // console.log("player1 gets the emit")

            }
        }, 1000)


        return;




    }
}
