import axios from "axios";
import { setupInterceptor } from "./interceptor";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

setupInterceptor(api)


export default api;
