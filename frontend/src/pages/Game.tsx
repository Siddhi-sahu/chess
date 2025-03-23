import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/Socket";
import { Chess } from "chess.js";
import Picture from "../assets/Screenshot 2025-03-06 144619.png";
import Confetti from "react-confetti";
import { useWindowSize } from 'react-use';


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
    const [whiteTime, setWhiteTime] = useState(60);
    const [blackTime, setBlackTime] = useState(60);
    const [winner, setWinner] = useState(null);
    // console.log("board", board);
    const { height, width } = useWindowSize()

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
                    setBoard(newChess.board());
                    setStarted(true);
                    setStarted1(true);
                    //send time message to the socket backenf
                    socket.send(JSON.stringify({
                        type: TIME
                    }))

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
                        if (timerInterval.current) {

                            stopTimer();
                        }
                        if (!timerInterval.current) {
                            starttimer();

                        }
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

                    if (!timerInterval.current) {
                        setTimeout(() => {
                            starttimer();

                        }, 20)

                    }

                    break;


                case GAME_OVER:
                    console.log("gameover, winner: ", message.payload.winner);
                    stopTimer();
                    timerInterval.current = null;

                    setWinner(message.payload.winner);
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
        if (started1 && !timerInterval.current) {
            starttimer();

        }


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

        // <ShowMoves />
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
                    {started1 === true ? <div><h2 className="text-xl font-semibold mb-4">Timer</h2>
                        {/* <p>{turn === "w" ? Math.max(whiteTime, 0) }</p> */}
                        <p>White: {Math.trunc(whiteTime / 60) + " : " + (whiteTime % 60).toString().padStart(2, "0")}</p>
                        <p>Black: {Math.trunc(blackTime / 60) + " : " + (blackTime % 60).toString().padStart(2, "0")}</p>
                    </div> : ""}
                    {started === false ? <Button onClick={handleClick} >
                        Play Now
                    </Button> : ""}

                    {winner && <Confetti width={width} height={height} />}

                    {winner && <div><h2 className="text-xl font-semibold mb-4">{winner === "w" ? "White Wins" : "Black Wins"}🏆</h2></div>}


                </div>
            </div>
        </div>

    )
}