import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/Game";



export const ChessBoard = ({ board, socket }: {
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
                        return <div onClick={() => {
                            if (!from) {
                                setFrom(square?.square ?? null);
                            } else {
                                setTo(square?.square ?? null);
                                socket.send(JSON.stringify({
                                    type: MOVE,
                                    from,
                                    to
                                }))

                            }
                        }}


                            key={j} className={`w-16 h-16 ${(i + j) % 2 === 0 ? "bg-[#5A3D1E]" : "bg-[#2A1A0A] "} text-white flex justify-center items-center`}>
                            <div>

                                {square ? square.type : ""}

                            </div>
                        </div>
                    })}
                </div>
            })}

        </div>
    </div>
}