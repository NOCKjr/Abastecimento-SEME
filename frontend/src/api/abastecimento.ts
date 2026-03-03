import type { Abastecimento, NovoAbastecimento } from "../types/abastecimento";

const API_URL = import.meta.env.VITE_API_URL + "/api/abastecimentos/";

export async function listarAbastecimentos(): Promise<Abastecimento[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Erro ao buscar abastecimentos");
  }
  return response.json();
}

export async function criarAbastecimento(
  dados: NovoAbastecimento
): Promise<Abastecimento> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar abastecimento");
  }

  return response.json();
}