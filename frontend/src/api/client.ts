import axios from "axios";
import { ACCESS_TOKEN_STORAGE_KEY, clearAuthTokens } from "../auth/auth";

export const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token automaticamente em todas as chamadas
client.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptador de erro
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Erro de autorização (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      clearAuthTokens();

      // Redireciona para o login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
