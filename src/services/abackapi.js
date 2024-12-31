import axios from "axios";

const abackapi = axios.create({
    baseURL: import.meta.env.VITE_ABACK_ENDPOINT,
});

export default abackapi;