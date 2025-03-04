import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/Socket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();
    //chess state
    const [chess, setChess] = useState(new Chess());
    //board physical
    const [board, setBoard] = useState(chess.board());
    const [color, setColor] = useState<"w" | "b">("w");
    console.log("board", board);


    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);

            switch (message.type) {
                case INIT_GAME:
                    setColor(message.payload.color);
                    const newChess = new Chess();
                    setChess(newChess);
                    setBoard(chess.board());
                    break;

                case MOVE:
                    console.log("move");
                    setChess((prevChess) => {
                        const newChess = new Chess(prevChess.fen());
                        const move = newChess.move(message.payload);
                        if (move) setBoard(chess.board());
                        return newChess;

                    })


                    break;

                case GAME_OVER:
                    console.log("gameover");
                    break;


                default:
                    break;
            }
        }

    }, [socket, chess])

    if (!socket) return <div>Connecting...</div>;

    const handleClick = () => {
        socket.send(JSON.stringify({
            type: INIT_GAME
        }));
    }
    return (
        <div className="flex w-full h-screen items-center justify-center bg-[#2a1a0a] p-6">
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4 w-full max-w-6xl">
                {/* Chess Board Section */}
                <div className="bg-[#3e2c19] col-span-6 flex items-center justify-center rounded-lg shadow-lg p-6">
                    <ChessBoard setBoard={setBoard} chess={chess} board={board} socket={socket} playerColor={color} />
                </div>

                {/* Controls Section */}
                <div className="bg-[#5a3d1e] col-span-2 flex flex-col items-center justify-center rounded-lg shadow-lg p-6 text-white">
                    {/* <h2 className="text-xl font-semibold mb-4">Game Controls</h2> */}
                    <Button onClick={handleClick} >
                        Play Now
                    </Button>
                </div>
            </div>
        </div>

    )
}