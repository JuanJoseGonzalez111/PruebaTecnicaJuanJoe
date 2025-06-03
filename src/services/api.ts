import axios from "axios"
import { message } from "antd"

const API_BASE_URL = "https://localhost:7065/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})


api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error)
        message.error("Error de conexión con el servidor")
        return Promise.reject(error)
    },
)

export default api
