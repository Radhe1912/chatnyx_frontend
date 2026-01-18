import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../components/ChatHeader";
import { useSocket } from "../context/SocketContext";
import { useEffect } from "react";

export default function ChatPage() {
    const [activeChat, setActiveChat] = useState(null);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket || !activeChat) return;

        socket.emit("join_chat", activeChat.id);

        return () => {
            socket.emit("leave_chat", activeChat.id);
        };
    }, [socket, activeChat]);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar setActiveChat={setActiveChat} />

            {activeChat ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <ChatHeader chat={activeChat} />
                    <MessageList chatId={activeChat.id} />
                    <MessageInput chatId={activeChat.id} />
                </div>
            ) : (
                <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
                    Select a chat
                </div>
            )}
        </div>
    );
}
