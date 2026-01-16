import axios from "axios";

const API = "http://localhost:5000";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* Fetch all chats */
export const fetchChats = () => {
    return axios.get(`${API}/chats`, {
        headers: authHeaders(),
    });
};

/* Get chat by ID (optional) */
export const getChatById = (chatId) => {
    return axios.get(`${API}/chats/${chatId}`, {
        headers: authHeaders(),
    });
};

/* ✅ CREATE PRIVATE CHAT */
export const createChat = (otherUserId) => {
    return axios.post(
        `${API}/chats/private`,
        { userId: otherUserId },
        {
            headers: authHeaders(),
        }
    );
};
