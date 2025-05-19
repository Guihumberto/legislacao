import axios from "axios";

const api = axios.create({
    baseURL: "https://sso.sefaz.ma.gov.br/auth/realms/Sefaz-externos/protocol/openid-connect/token"
})

export default api