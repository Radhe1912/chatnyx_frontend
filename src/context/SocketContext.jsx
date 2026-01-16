import { createContext, useContext } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    auth: {
        token: localStorage.getItem("token"),
    },
});

const SocketContext = createContext();

export const SocketProvider = ({ children }) => (
    <SocketContext.Provider value={{ socket }}>
        {children}
    </SocketContext.Provider>
);

export const useSocket = () => useContext(SocketContext);
