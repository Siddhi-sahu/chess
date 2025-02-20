import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/Game";
import { Pieces } from "./Pieces";



export const ChessBoard = ({ setBoard, chess, board, socket }: {
    setBoard: any,
    chess: Chess,
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket
}) => {
    const [from, setFrom] = useState<Square | null>(null);
    const [to, setTo] = useState<Square | null>(null);



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
                                setFrom(squareRepresentation);
                            } else {
                                setTo(squareRepresentation);
                                socket.send(JSON.stringify({
                                    type: MOVE,
                                    payload: {
                                        move: {

                                            from,
                                            to: squareRepresentation
                                        }

                                    }
                                }));
                                setFrom(null);
                                chess.move({ from, to: squareRepresentation });
                                setBoard(chess.board());
                                console.log({
                                    from,
                                    to
                                })

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