import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api", // Adjust to your backend URL
});

// Add an interceptor to attach the JWT to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;