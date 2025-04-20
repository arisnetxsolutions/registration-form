import axios from "axios";
import { getToken } from "./authApi";
import { useAuthStore } from "../store/auth";
// Configuración de la base URL
const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log("🚀 ~ baseURL:", baseURL);

// Configuración base de Axios
const api = axios.create({
  baseURL,
  timeout: 10000, // Tiempo de espera de 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});
// Interceptor para adjuntar el token JWT en cada solicitud
api.interceptors.request.use(
  async (config) => {    // ⬇️ Accede al estado sin usar el hook directamente
    let { token: token } = useAuthStore.getState();
    if (!token) {
      token = await getToken(); // Intenta obtener el token si no está en localStorage
    }


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("🚀 ~ token:", token);
    return config;
  },
  (error) => Promise.reject(error)
);
// Interceptor de respuesta para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        useAuthStore.setState({ token: null });
        localStorage.removeItem("auth");
       // window.location.href = "/";
      } else if (status === 403 || status >= 500) {
        useAuthStore.setState({ token: null });
        localStorage.removeItem("auth");
        // window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
export default api;
