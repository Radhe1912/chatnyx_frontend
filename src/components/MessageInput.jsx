import { useState } from "react";
import { sendMessage } from "../api/message.api";
import { useSocket } from "../context/SocketContext";
import "./MessageInput.css";

export default function MessageInput({ chatId }) {
    const { socket } = useSocket();
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);

    const sendText = () => {
        if (!text.trim() || !chatId) return;

        socket.emit("send_message", {
            chatId,
            content: text,
            type: "text",
        });

        setText("");
    };

    const sendFile = async (e) => {
        const file = e.target.files[0];
        if (!file || !chatId) return;

        try {
            setSending(true);
            const res = await sendMessage(chatId, null, file);
            socket.emit("send_message", {
                chatId,
                content: res.data.content,
                type: "image",
            });
            socket.emit("new_message", res.data);
        } catch (err) {
            console.error("Image send failed", err);
        } finally {
            setSending(false);
            e.target.value = null;
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendText();
        }
    };

    return (
        <div className="message-input">
            <div className="input-container">
                <input
                    type="text"
                    className="text-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                />
                <div className="input-actions">
                    <label className="file-upload">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={sendFile}
                            disabled={sending}
                        />
                        📎
                    </label>
                    <button
                        className="send-button"
                        onClick={sendText}
                        disabled={!text.trim() || sending}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}