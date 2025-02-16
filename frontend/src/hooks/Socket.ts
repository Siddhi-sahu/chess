//websocket apis in browsers

import { useEffect, useState } from "react"

//custom hook
export const getSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const WS_URL = "ws://localhost:8080";

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