import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../components/ChatHeader";

export default function ChatPage() {
    const [activeChat, setActiveChat] = useState(null);

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
