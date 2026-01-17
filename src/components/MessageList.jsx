import { useEffect, useState, useRef } from "react";
import { getMessagesByChat } from "../api/message.api";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import "./MessageList.css"

export default function MessageList({ chatId }) {
    const { socket } = useSocket();
    const { auth } = useAuth();

    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);

    const API = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (!chatId || !socket) return;

        getMessagesByChat(chatId).then(res => {
            setMessages(res.data);
        });

        socket.emit("join_chat", chatId);

        return () => {
            socket.emit("leave_chat", chatId);
        };
    }, [chatId, socket]);

    useEffect(() => {
        if (!socket || !chatId) return;

        const markReadIfVisible = () => {
            if (document.visibilityState === "visible") {
                socket.emit("mark_seen", { chatId });
            }
        };

        markReadIfVisible();
        document.addEventListener("visibilitychange", markReadIfVisible);

        return () => {
            document.removeEventListener("visibilitychange", markReadIfVisible);
        };
    }, [chatId, socket]);

    useEffect(() => {
        if (!socket) return;

        const onNewMessage = msg => {
            if (msg.chat_id !== chatId) return;

            setMessages(prev => [
                ...prev,
                {
                    ...msg,
                    status:
                        msg.sender_id === auth.user.id
                            ? "sent"
                            : "delivered"
                }
            ]);
        };

        const onSeen = ({ chatId: seenChatId }) => {
            if (seenChatId !== chatId) return;

            setMessages(prev =>
                prev.map(m =>
                    m.sender_id === auth.user.id && m.status !== "read"
                        ? { ...m, status: "read" }
                        : m
                )
            );
        };

        socket.on("new_message", onNewMessage);
        socket.on("messages_seen", onSeen);

        return () => {
            socket.off("new_message", onNewMessage);
            socket.off("messages_seen", onSeen);
        };
    }, [socket, chatId, auth.user.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="message-list">
            {messages.map(msg => {
                const isMe = msg.sender_id === auth.user.id;

                return (
                    <div
                        key={msg.id}
                        className={`message-container ${isMe ? 'message-right' : 'message-left'}`}
                    >
                        <div className={`message-bubble ${isMe ? 'message-bubble-me' : 'message-bubble-other'}`}>
                            {msg.type === "text" && (
                                <div className="message-text">{msg.content}</div>
                            )}

                            {msg.type === "image" && (
                                <div className="message-image">
                                    <img
                                        src={`${API}${msg.content}`}
                                        alt="Message attachment"
                                    />
                                </div>
                            )}

                            {isMe && (
                                <div className="message-meta">
                                    <span className="message-time">
                                        {new Date(msg.created_at).toLocaleTimeString(
                                            [],
                                            { hour: "2-digit", minute: "2-digit" }
                                        )}
                                    </span>
                                    <span className={`message-status ${msg.status}`}>
                                        {msg.status === "sent" && "✓"}
                                        {msg.status === "delivered" && "✓✓"}
                                        {msg.status === "read" && "✓✓"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} className="scroll-anchor" />
        </div>
    );
}