import { useEffect, useState } from "react";
import { fetchChats, createChat } from "../api/chat.api";
import { searchUsers } from "../api/user.api";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css"

export default function Sidebar({ setActiveChat }) {
    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const { auth } = useAuth();

    useEffect(() => {
        fetchChats().then(res => setChats(res.data));
    }, []);

    useEffect(() => {
        if (!search) {
            setUsers([]);
            return;
        }

        searchUsers(search).then(res => {
            setUsers(res.data);
        });
    }, [search]);

    const filteredChats = chats.filter(chat => {
        const name =
            chat.type === "group"
                ? chat.name
                : chat.members?.find(
                    m => m.user_id !== auth.user.id
                )?.username;

        return name?.toLowerCase().includes(search.toLowerCase());
    });

    async function startChat(user) {
        try {
            const res = await createChat(user.id);
            setActiveChat(res.data);
            setSearch("");
        } catch (err) {
            console.error("Failed to start chat", err);
        }
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3 className="sidebar-title">Chats</h3>
            </div>

            <div className="search-container">
                <input
                    className="search-input"
                    placeholder="Search user or chat"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {users.length > 0 && (
                <div className="users-section">
                    <div className="section-label">Users</div>
                    {users.map(user => (
                        <div
                            key={user.id}
                            className="user-item"
                            onClick={() => startChat(user)}
                        >
                            <div className="user-avatar">👤</div>
                            <div className="user-info">
                                <div className="user-name">{user.username}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="chats-section">
                <div className="section-label">Recent Chats</div>
                {filteredChats.map(chat => (
                    <div
                        key={chat.id}
                        className="chat-item"
                        onClick={() => setActiveChat(chat)}
                    >
                        <div className="chat-avatar">
                            {chat.type === "group" ? "👥" : "👤"}
                        </div>
                        <div className="chat-info">
                            <div className="chat-name">
                                {chat.type === "group" ? chat.name : chat.members?.find(
                                    m => m.user_id !== auth.user.id
                                )?.username}
                            </div>
                            <div className="chat-last-message">
                                {chat.last_message || "Start a conversation"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}