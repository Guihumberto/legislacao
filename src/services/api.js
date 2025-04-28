import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_ENDPOINT,
    auth: {
        username: import.meta.env.VITE_USER,
        password: import.meta.env.VITE_PASSWORD
    }
})

export default api
