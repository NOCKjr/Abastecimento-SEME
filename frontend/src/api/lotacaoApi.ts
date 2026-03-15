import { client } from "./client"
import type { Lotacao } from "../types/models"

export const lotacaoApi = {
  lotacaoAtual(condutorId: number, data?: string) {
    return client.get<{ lotacao: Lotacao | null }>(
      `/frota/condutores/${condutorId}/lotacao-atual/`,
      { params: data ? { data } : undefined }
    )
  }
}

