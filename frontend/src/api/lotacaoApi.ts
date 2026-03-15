import { client } from "./client"
import type { Lotacao } from "../types/models"

export const lotacaoApi = {
  listar(params?: { condutor?: number; rota?: number; data?: string; ativa?: boolean | "" }) {
    return client.get<Lotacao[]>(`/frota/lotacoes/`, { params })
  },

  buscarPorId(id: number) {
    return client.get<Lotacao>(`/frota/lotacoes/${id}/`)
  },

  criar(data: Lotacao) {
    return client.post<Lotacao>(`/frota/lotacoes/`, data)
  },

  atualizar(id: number, data: Partial<Lotacao>) {
    return client.put<Lotacao>(`/frota/lotacoes/${id}/`, data)
  },

  deletar(id: number) {
    return client.delete(`/frota/lotacoes/${id}/`)
  },

  lotacaoAtual(condutorId: number, data?: string) {
    return client.get<{ lotacao: Lotacao | null }>(
      `/frota/condutores/${condutorId}/lotacao-atual/`,
      { params: data ? { data } : undefined }
    )
  },

  buscar(condutorId: number, rotaId?: number, data?: string) {
    return client.get<Lotacao[]>(
      `/frota/lotacoes/`,
      { params: { condutor: condutorId, ...(rotaId ? { rota: rotaId } : {}), ...(data ? { data } : {}) } }
    )
  }
}

