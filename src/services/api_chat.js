import axios from "axios";

const baseURL =
  import.meta.env.VITE_CHATENDPOINT || import.meta.env.VITE_CHATENDPOINT2;

const api = axios.create({
  baseURL
});

export default api;