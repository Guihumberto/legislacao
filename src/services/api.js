import axios from "axios";

const api = axios.create({
    baseURL: "https://legislacaoapi.sefaz.ma.gov.br/"
})

const api3 = axios.create({
    baseURL: "http://localhost:9200/"
})

const api2 = axios.create({
    baseURL: import.meta.env.VITE_ENDPOINT,
    auth: {
        username: import.meta.env.VITE_USER,
        password: import.meta.env.VITE_PASSWORD
    }
})

export default api2
