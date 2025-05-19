import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_CHATENDPOINT
})

export default api
