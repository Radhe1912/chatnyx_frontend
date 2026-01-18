// src/api/message.api.js
import axios from "./axios";

const API = import.meta.env.VITE_BACKEND_URL;

export const getMessagesByChat = (chatId, limit = 20, offset = 0) => {
    return axios.get(`/messages/${chatId}?limit=${limit}&offset=${offset}`);
};

export const getMessages = (chatId) =>
    axios.get(`${API}/messages/${chatId}`);

// export const uploadMedia = (formData) => {
//     const token = localStorage.getItem("token");

//     return axios.post("/media/upload", formData, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data"
//         }
//     });
// };

export const sendMessage = (chatId, text, imageFile) => {
    const formData = new FormData();

    formData.append("chatId", chatId);

    if (text) {
        formData.append("content", text);
        formData.append("type", "text");
    }

    if (imageFile) {
        formData.append("image", imageFile);
        formData.append("type", "image");
    }

    return axios.post("/messages", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const markMessagesRead = (chatId) => {
    return axios.post("/messages/read", { chatId });
};
