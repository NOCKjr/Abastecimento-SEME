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

// Variáveis para gerenciar a fila de requisições
let isRefreshing = false;
let failedQueue: any[] = [];

// Processa a fila de requisições (fornece um novo token para todos ou null)
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor para tratar tokens expirados
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Deu erro de autorização (401) e é a primeira tentativa
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Se já estamos renovando o token, coloca esta requisição na fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        const refreshToken = localStorage.getItem('refresh_token');
        
        axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        })
          .then((res) => {
            const { access } = res.data;
            localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access);
            
            originalRequest.headers.Authorization = `Bearer ${access}`;
            
            processQueue(null, access); // Libera a fila com o novo token
            resolve(client(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null); // Rejeita toda a fila
            clearAuthTokens();
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);