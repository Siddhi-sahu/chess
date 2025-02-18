import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/Socket";
import { Chess } from "chess.js";

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    console.log("board", board);


    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);

            switch (message.type) {
                case INIT_GAME:
                    const newChess = new Chess();
                    setChess(newChess);
                    setBoard(newChess.board());
                    break;

                case MOVE:
                    console.log("move");
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    break;

                case GAME_OVER:
                    console.log("gameover");
                    break;


                default:
                    break;
            }
        }

    }, [socket])

    if (!socket) return <div>Connecting...</div>;

    const handleClick = () => {
        socket.send(JSON.stringify({
            type: INIT_GAME
        }));
    }
    return (
        <div className="flex w-full max-h-screen items-center justify-center">

            <div className="grid grid-cols-1 md:grid-cols-8 ">
                <div className="bg-red-100 col-span-6 m-5 ">
                    <div className="w-full ">

                        <ChessBoard board={board} />
                    </div>


                </div>
                <div className="bg-green-200 col-span-2 m-5 ">
                    <div className="p-10">

                        <Button onClick={handleClick}>
                            Play Now
                        </Button>
                    </div>

                </div>

            </div>
        </div>

    )
}

//but where is row and i coming from? are we defining it? what parameters does .map() expects?