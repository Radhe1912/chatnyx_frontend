import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

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

export const createGroupChat = (name, members) => {
  return axios.post(
    `${API}/chats/group`,
    { name, members },
    { headers: authHeaders() }
  );
};
