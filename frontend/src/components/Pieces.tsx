import { Color, PieceSymbol, Square } from "chess.js";
import Bking from "../assets/pieces/Bking.png";
import Wking from "../assets/pieces/Wking.png";
import BPawm from "../assets/pieces/BPawn.png";
import WPawn from "../assets/pieces/WPawn.png";
import BRook from "../assets/pieces/BRook.png";
import WRook from "../assets/pieces/WRook.png";
import Wbishop from "../assets/pieces/WBishop.png";
import Bbishop from "../assets/pieces/Bbishop.png";
import BQueen from "../assets/pieces/BQueen.png";
import WQueen from "../assets/pieces/WQueen.png";
import WKnight from "../assets/pieces/Wknight.png";
import BKnight from "../assets/pieces/Bknight.png";


export const Pieces = ({ square }: {
    square: {
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null
}) => {
    if (square?.color == 'b') {
        if (square.type == 'k') {

            return <>
                <img src={Bking} />
            </>
        } else if (square.type == 'p') {
            return <img src={BPawm} />

        } else if (square.type == 'r') {
            return <img src={BRook} />
        } else if (square.type == 'b') {
            return <img src={Bbishop} />

        } else if (square.type == 'q') {
            return <img src={BQueen} />

        } else {
            return <img src={BKnight} />
        }
    } else {

        if (square?.type == 'k') {
            return <img src={Wking} />

        } else if (square?.type == 'p') {
            return <img src={WPawn} />

        }
        else if (square?.type == 'r') {
            return <img src={WRook} />
        } else if (square?.type == 'b') {
            return <img src={Wbishop} />

        } else if (square?.type == 'q') {
            return <img src={WQueen} />

        } else {
            return <img src={WKnight} />
        }

    }

}