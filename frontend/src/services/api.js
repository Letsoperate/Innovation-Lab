import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: BACKEND_URL ? `${BACKEND_URL}/api` : "/api",
  headers: { "Content-Type": "application/json" },
});

const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
