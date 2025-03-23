//websocket apis in browsers

import { useEffect, useState } from "react"

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";
//custom hook
export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            setSocket(ws);
        }

        //disconnection of server should be reflected in react state        
        ws.onclose = () => {
            setSocket(null);
        }

        return () => {
            //close the ws connection on unmount of component
            ws.close();
        }
    }, []);

    return socket;
}