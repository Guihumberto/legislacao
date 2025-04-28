import axios from "axios";

const headers = {
    Authorization: `Bearer ${ import.meta.env.VITE_HFACE}`,
  };


const api = axios.create({
    baseURL:  "https://api-inference.huggingface.co/models/",
    headers
})

export default api