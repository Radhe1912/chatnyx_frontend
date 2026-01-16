// src/api/message.api.js
import axios from "./axios";

const API = "http://localhost:5000";

export const getMessagesByChat = (chatId, limit = 20, offset = 0) => {
    return axios.get(`/messages/${chatId}?limit=${limit}&offset=${offset}`);
};

export const getMessages = (chatId) =>
    axios.get(`http://localhost:5000/messages/${chatId}`);

export const uploadMedia = (formData) => {
    const token = localStorage.getItem("token");

    return axios.post("/media/upload", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });
};

export const markMessagesRead = (chatId) => {
    return axios.post("/messages/read", { chatId });
};
