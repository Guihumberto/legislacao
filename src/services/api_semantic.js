import axios from "axios";

const api = axios.create({
    baseURL: "http://172.20.3.51:8001/"
})

const api3 = axios.create({
    baseURL: "http://127.0.0.1:8000/"
})

export default api3