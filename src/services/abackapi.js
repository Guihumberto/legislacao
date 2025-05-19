import axios from "axios";

const abackapi = axios.create({
  baseURL: "https://ec2-18-221-203-147.us-east-2.compute.amazonaws.com/",  // Usando o prefixo /api configurado no proxy
});

export default abackapi;