import { client } from "./client";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "../auth/auth";

export const loginService = async (cpf: string, password: string) => {
  try {
    const response = await client.post("/login/", { cpf, password });

    // Salva os tokens no localStorage
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, response.data.access);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.data.refresh);

    return response.data;
  } catch {
    throw new Error("CPF ou senha inválidos");
  }
};

