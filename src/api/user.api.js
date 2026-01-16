import api from "./axios";

export const searchUsers = (query) => {
    return api.get(`/users/search?q=${query}`);
};
