

import ChessBoard from "../assets/chessBoard.jpeg";

export const Landing = () => {
    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-[#2a1a0a]">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl shadow-lg rounded-lg overflow-hidden bg-[#3e260e]">

                <div className="relative w-full h-[500px] md:h-screen">
                    <img src={ChessBoard} className="w-full h-full object-cover" alt="Chess Board" />
                </div>


                <div className="bg-[#5a3d1e] flex flex-col items-center justify-center text-center p-10 text-gold">
                    <button className="mb-6 bg-gradient-to-r from-[#c29f59] to-[#e6c37b] text-[#3e260e] font-bold px-8 py-3 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                        Play Now
                    </button>
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
