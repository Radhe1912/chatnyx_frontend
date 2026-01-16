import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./ChatHeader.css"

export default function ChatHeader({ chat }) {
    const { auth } = useAuth();
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (!chat) return;

        if (chat.type === "group") {
            setTitle(chat.name);
        } else {
            const otherUser = chat.members?.find(
                m => m.user_id !== auth.user.id
            );
            setTitle(otherUser?.username || "Private Chat");
        }
    }, [chat, auth.user.id]);

    if (!chat) return null;

    return (
        <div className="chat-header">
            <div className="header-content">
                <div className="chat-avatar-header">
                    {chat.type === "group" ? "👥" : "👤"}
                </div>
                <div className="chat-info-header">
                    <h3 className="chat-title">{title}</h3>
                    <div className="chat-status">
                        {chat.type === "group"
                            ? `${chat.member_count || 0} members`
                            : "Online"
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}