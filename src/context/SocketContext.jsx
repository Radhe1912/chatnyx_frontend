import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const s = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", {
            auth: {
                token: localStorage.getItem("token"),
            },
            transports: ["websocket"],
        });

        setSocket(s);

        // CLEANUP
        return () => {
            s.disconnect();
        };
    }, []);

    // Send heartbeat every 30s to keep online presence alive
    useEffect(() => {
        if (!socket) return;
        const interval = setInterval(() => {
            socket.emit("heartbeat");
        }, 30000);
        return () => clearInterval(interval);
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
