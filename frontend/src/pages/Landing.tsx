

import { useNavigate } from "react-router-dom";
import ChessBoard from "../assets/chessBoard.jpeg";
import { Button } from "../components/Button";

export const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-[#2a1a0a]">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl shadow-lg rounded-lg overflow-hidden bg-[#3e260e]">

                <div className="relative w-full h-[500px] md:h-screen">
                    <img src={ChessBoard} className="w-full h-full object-cover" alt="Chess Board" />
                </div>


                <div className="bg-[#5a3d1e] flex flex-col items-center justify-center text-center p-10 text-gold">
                    <Button onClick={() => navigate("/game")}>
                        Play Now
                    </Button>
                    <h1 className="text-4xl md:text-5xl text-[#f3e2c7] font-bold leading-tight drop-shadow-lg">
                        Play Chess Online
                    </h1>
                    <h1 className="text-4xl md:text-5xl text-[#f3e2c7] font-bold">
                        on the #3 Site!
                    </h1>
                </div>
            </div>
        </div>
    );
};
