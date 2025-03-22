import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/Socket";
import { Chess } from "chess.js";
import { ShowMoves } from "../components/ShowMoves";
import Picture from "../assets/Screenshot 2025-03-06 144619.png";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const BOARD = "board";
export const TIME = "time";

export const Game = () => {
    const socket = useSocket();
    //chess state
    const [chess, setChess] = useState(new Chess());
    //board physical
    const [board, setBoard] = useState(chess.board());
    const [color, setColor] = useState<"w" | "b">("w");
    const [started, setStarted] = useState(false);
    const [started1, setStarted1] = useState(false);
    let [whiteTime, setWhiteTime] = useState(300);
    let [blackTime, setBlackTime] = useState(300);
    // console.log("board", board);

    //store timer; ques => wont this be reinitialized to null on rerenders??
    let timerInterval = useRef<NodeJS.Timeout | null>(null);;



    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);

            switch (message.type) {
                case INIT_GAME:
                    console.log("game has begin")
                    setColor(message.payload.color);
                    const newChess = new Chess();
                    setChess(newChess);
                    setBoard(chess.board());
                    setStarted(true);
                    setStarted1(true);
                    starttimer();
                    break;

                case MOVE:
                    console.log("move");
                    try {

                        setChess((prevChess) => {
                            const newChess = new Chess(prevChess.fen());
                            const move = newChess.move(message.payload);
                            if (move) setBoard(chess.board());

                            return newChess;

                        });

                        //when a move is made the current playerstimer sould stop and mext players should start
                        stopTimer();
                        starttimer();





                    } catch (e) {
                        console.log("error maving move", e)
                    }



                    break;

                case BOARD:
                    console.log("message : ", message);
                    setBoard(message.payload);

                    break;
                case TIME:
                    console.log("time");
                    //stop local timer?
                    stopTimer();

                    setBlackTime(message.payload.blackTime);

                    setWhiteTime(message.payload.whiteTime);

                    //start local timer? ;; with updated state

                    setTimeout(() => {
                        starttimer();

                    }, 10)
                    break;


                case GAME_OVER:
                    console.log("gameover, winner: ", message.payload.winner);
                    stopTimer();
                    timerInterval.current = null;
                    break;



                default:
                    break;
            }
        }

    }, [socket, chess]);

    const starttimer = () => {
        //if a timer exists we need to null it
        if (timerInterval.current) return;

        timerInterval.current = setInterval(() => {
            //When setInterval runs after the WebSocket update, it sees prevWhite = 250 and does nothing because the time is already correct.
            //only update frontend timer if the websocket b.e. hadnt done it yet


            setWhiteTime((preWhite) => {
                if (chess.turn() === "w" && preWhite > 0) {
                    return preWhite - 1;
                }


                return preWhite;
            })
            setBlackTime((prevBlack) => {
                if (chess.turn() === "b" && prevBlack > 0) {
                    return prevBlack - 1;

                }


                return prevBlack;
            })

            console.log("bklacktime:", blackTime);
            console.log("whitetime:", whiteTime);


        }, 1000);

    }

    const stopTimer = () => {
        if (timerInterval.current) {
            clearInterval(timerInterval.current);

            timerInterval.current = null;
        }

    }


    useEffect(() => {
        starttimer();


        return () => {
            stopTimer();
        }

    }, [started1])

    if (!socket) return <div>Connecting...</div>;



    const handleClick = () => {
        socket.send(JSON.stringify({
            type: INIT_GAME
        }));

        setStarted(true);

        <ShowMoves />
    }
    return (
        <div className="flex w-full h-screen items-center justify-center bg-[#2a1a0a] p-6">

            <div className="grid grid-cols-1 md:grid-cols-8 gap-4 w-full max-w-6xl">

                {/* Chess Board Section */}
                <div className="bg-[#3e2c19] col-span-6 flex items-center justify-center rounded-lg shadow-lg p-6">
                    {started1 === false ? <img src={Picture} /> : <ChessBoard setBoard={setBoard} chess={chess} board={board} socket={socket} playerColor={color} />}
                </div>

                {/* Controls Section */}

                <div className="bg-[#5a3d1e] col-span-2 flex flex-col items-center justify-center rounded-lg shadow-lg p-6 text-white">
                    {/* <h2 className="text-xl font-semibold mb-4">Game Controls</h2> */}
                    {started1 === true ? <div><h2 className="text-xl font-semibold mb-4">Timer</h2>
                        {/* <p>{turn === "w" ? Math.max(whiteTime, 0) }</p> */}
                        <p>White: {Math.trunc(whiteTime / 60) + " : " + (whiteTime % 60)}</p>
                        <p>Black: {Math.trunc(blackTime / 60) + " : " + (blackTime % 60)}</p>
                    </div> : ""}
                    {started === false ? <Button onClick={handleClick} >
                        Play Now
                    </Button> : ""}


                </div>
            </div>
        </div>

    )
}