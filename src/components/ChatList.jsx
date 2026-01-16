import { useState, useEffect } from 'react'
import { fetchChats } from '../api/chat.api';

export default function ChatList({ setChatId }) {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        fetchChats().then(res => setChats(res.data));
    }, []);

    return (
        <div>
            {chats.map(c => (
                <div
                    key={c.id}
                    onClick={() => setChatId(c.id)}
                >
                    {c.name}
                </div>
            ))}
        </div>
    );
}
