import { Chess, Color, PieceSymbol, Square } from "chess.js";

interface BoardProps {
    square: Square;
    type: PieceSymbol;
    color: Color;
}
export const ChessBoard = () => {

    const chess = new Chess();
    const board = chess.board();

    return <div>
        {/* square bloacks */}
        {board.map((square, i) => {

        })}
    </div>
}