import axios from "axios";
const API_URL = "https://weathernow-7i7a.onrender.com"

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 10000,
});

export default apiClient;
