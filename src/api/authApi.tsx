import axios from "axios";
import { useAuthStore } from "../store/auth";
interface AuthResponse {
  token: string;
}
export const getToken = async (): Promise<string | null> => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const userName = import.meta.env.VITE_AUTH_USERNAME_TOKEN;
    const password = import.meta.env.VITE_AUTH_PASSWORD_TOKEN;
    // Configuración base de Axios
    const api = axios.create({
      baseURL,
      timeout: 10000, // Tiempo de espera de 10 segundos
      headers: {
        "Content-Type": "application/json",
      },
    });
    const credentials = {
      userName: userName,
      password: password,
    };
    const response = await api.post<AuthResponse>("/Authentication", credentials);

    if (response.data && response.data.token) {
      useAuthStore.setState({ token: response.data.token });
      return response.data.token;
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo el token:", error);
    return null;
  }
};
