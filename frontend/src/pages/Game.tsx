import { useEffect } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/Socket";

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();


    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);

            switch (message.type) {
                case INIT_GAME:
                    console.log("init game")

                    break;

                case MOVE:
                    console.log("move");
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
                    <ChessBoard />


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