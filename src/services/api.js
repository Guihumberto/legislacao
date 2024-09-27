import axios from "axios";

const api = axios.create({
    baseURL: "https://legislacaoapi.sefaz.ma.gov.br/"
})

const api3 = axios.create({
    baseURL: "http://localhost:9200/"
})

const elasticCloudUrl = 'https://a97217094b87457f810aa3c8d70d1d6b.us-central1.gcp.cloud.es.io:443'; // Substitua pelo seu URL do Elasticsearch na Elastic Cloud
const elasticCloudCredentials = 'joao.junior:RcLsPtb7yCgN6rc'; // Substitua pelo seu usuário e senha

const cloudId = '2ed5e602748a410a9cc277681c8e2646:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGE5NzIxNzA5NGI4NzQ1N2Y4MTBhYTNjOGQ3MGQxZDZiJDNlODk4YTAyMDdhYTRhN2JiYjUxODBhNTc0ZjFhODFk';

const api2 = axios.create({
    baseURL: elasticCloudUrl,
    auth: {
        username: elasticCloudCredentials.split(':')[0],
        password: elasticCloudCredentials.split(':')[1]
    }
})


export default api2
