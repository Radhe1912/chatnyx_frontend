import { useEffect, useState } from "react";
import { fetchChats, createChat, createGroupChat } from "../api/chat.api";
import { searchUsers } from "../api/user.api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Sidebar.css"

export default function Sidebar({ setActiveChat }) {
    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const { auth } = useAuth();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);

    async function createGroup() {
        if (!groupName || selectedUsers.length === 0) {
            alert("Group name and members required");
            return;
        }

        try {
            const res = await createGroupChat(groupName, selectedUsers);
            setChats(prev => [res.data, ...prev]);
            setActiveChat(res.data);

            // reset
            setShowGroupModal(false);
            setGroupName("");
            setSelectedUsers([]);
        } catch (err) {
            console.error("Group creation failed", err);
        }
    }

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

    function logoutUser() {
        try {
            let ans = confirm("Want to logout???");
            if (ans) {
                logout();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 className="sidebar-title">Chats</h3>
                <button className="group-btn" onClick={() => setShowGroupModal(true)}>
                    + Group
                </button>
                <button className="logout-btn" onClick={logoutUser}>Logout</button>
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

            {showGroupModal && (
                <div className="group-modal">
                    <h4>Create Group</h4>

                    <input
                        placeholder="Group name"
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                        className="text-input"
                    />

                    <div className="group-users">
                        {users.map(user => (
                            <label key={user.id} className="group-user">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() =>
                                        setSelectedUsers(prev =>
                                            prev.includes(user.id)
                                                ? prev.filter(id => id !== user.id)
                                                : [...prev, user.id]
                                        )
                                    }
                                />
                                {user.username}
                            </label>
                        ))}
                    </div>

                    <button className="group-btn" style={{ margin: '5px' }} onClick={createGroup}>Create</button>
                    <button className="group-btn" onClick={() => setShowGroupModal(false)}>Cancel</button>
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