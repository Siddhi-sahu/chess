import { Color, PieceSymbol, Square } from "chess.js";


export const ChessBoard = ({ board }: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]
}) => {



    return <div className="bg-white">
        {/* rows */}
        {board.map((row, i) => {
            return <div key={i} className="flex">
                {row.map((square, j) => {
                    return <div key={j} className={`w-16 h-16 ${(i + j) % 2 === 0 ? "bg-[#5A3D1E]" : "bg-[#2A1A0A] "} text-white flex justify-center items-center`}>
                        <div>

                            {square ? square.type : ""}
                        </div>
                    </div>
                })}
            </div>
        })}

    </div>
}