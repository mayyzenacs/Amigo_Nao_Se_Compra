import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

console.log(api.defaults.baseURL);

export default api;
