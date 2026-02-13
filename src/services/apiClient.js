import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 10000,
});

export default apiClient;
