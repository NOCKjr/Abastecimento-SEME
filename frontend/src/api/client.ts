import type { Secretaria } from "../types/models"

const API_URL = import.meta.env.VITE_API_URL + "/api";

// --------------------
// Secretarias
// --------------------

export async function createSecretaria(
  data: Secretaria
): Promise<Secretaria> {

  const res = await fetch(
    `${API_URL}/cadastros/secretarias/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  )

  return res.json()
}

export async function listarSecretarias(): Promise<Secretaria[]> {
  const response = await fetch(`${API_URL}/cadastros/secretarias/`);
  if (!response.ok) {
    throw new Error("Erro ao buscar abastecimentos");
  }
  return response.json();
}