import React from "react";

interface ButtonProps {
    onClick: () => void;
    children: string
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
    return <button className="mb-6 bg-gradient-to-r from-[#c29f59] to-[#e6c37b] text-[#3e260e] font-bold px-8 py-3 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl" onClick={onClick}>
        {children}
    </button>
}