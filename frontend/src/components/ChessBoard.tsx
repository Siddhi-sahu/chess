import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE } from "../pages/Game";
import { Pieces } from "./Pieces";



export const ChessBoard = ({ setBoard, chess, board, socket, playerColor }: {
    setBoard: any,
    chess: Chess,
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    playerColor: "w" | "b"
}) => {
    const [from, setFrom] = useState<Square | null>(null);
    // const [to, setTo] = useState<Square | null>(null);

    // useEffect(() => {
    //     socket.onmessage = (event) => {
    //         const message = JSON.parse(event.data);
    //         if (message.type == MOVE) {
    //             const move = message.payload;
    //             if (!move || !move.from || !move.to) {
    //                 console.log("invalid move ", move);
    //                 return;
    //             }
    //             const result = chess.move(move);
    //             if (!result) {
    //                 console.log("mmove rejected by chess.js ", move);
    //                 return;
    //             }

    //             setBoard(chess.board());
    //             console.log("Updated board. Next turn:", chess.turn());

    //         }


    //     }
    // }, [chess, setBoard, socket])


    return <div className="bg-white rounded-lg">
        {/* rows */}
        <div className="rounded-lg">

            {board.map((row, i) => {
                return <div key={i} className="flex">
                    {row.map((square, j) => {
                        const file = String.fromCharCode(97 + j);
                        const rank = 8 - i;
                        const squareRepresentation = `${file}${rank}` as Square;
                        return <div onClick={() => {
                            if (!from) {
                                if (square && chess.turn() == playerColor) {

                                    setFrom(squareRepresentation);
                                }
                            } else {
                                // setTo(squareRepresentation);
                                const moveTo = squareRepresentation;
                                if (chess.turn() != playerColor) {
                                    console.log("wrong person trying to move");
                                    return;
                                }
                                const move = chess.move({ from, to: moveTo });
                                if (!move) {
                                    console.log("iinvalid move: ", { from, to: moveTo });
                                    setFrom(null);
                                    return;
                                }
                                // chess.move({ from, to: moveTo });
                                socket.send(JSON.stringify({
                                    type: MOVE,
                                    payload: {
                                        move: {

                                            from,
                                            to: moveTo
                                        }

                                    }
                                }));
                                setFrom(null);
                                setBoard(chess.board());
                                console.log({ from, to: moveTo, turn: chess.turn() });


                            }
                        }}


                            key={j} className={`w-16 h-16 ${(i + j) % 2 === 0 ? "bg-[#5A3D1E]" : "bg-[#2A1A0A] "} text-white flex justify-center items-center`}>
                            <div>

                                {square ? <Pieces square={square} /> : ""}

                            </div>
                        </div>
                    })}
                </div>
            })}





        </div>
    </div>

}