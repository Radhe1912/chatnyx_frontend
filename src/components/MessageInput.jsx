import { useState } from "react";
import { useSocket } from "../context/SocketContext";
import { uploadMedia } from "../api/message.api";
import "./MessageInput.css"

export default function MessageInput({ chatId }) {
    const { socket } = useSocket();
    const [text, setText] = useState("");

    const sendText = () => {
        if (!text.trim()) return;

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

        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadMedia(formData);

        socket.emit("send_message", {
            chatId,
            content: res.data.url,
            type: "image",
        });

        e.target.value = null;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
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
                    onChange={e => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                />
                <div className="input-actions">
                    <label className="file-upload">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={sendFile}
                        />
                        📎
                    </label>
                    <button
                        className="send-button"
                        onClick={sendText}
                        disabled={!text.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}