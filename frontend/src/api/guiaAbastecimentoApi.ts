import { client } from "./client"
import type { GuiaAbastecimento } from "../types/models"

const API_URL = "/abastecimento/guias"

export const guiaAbastecimentoApi = {

  listar() {
    return client.get<GuiaAbastecimento[]>(`${API_URL}/`)
  },
  
  buscar(id: number) {
    return client.get<GuiaAbastecimento>(`${API_URL}/${id}/`)
  },

  criar(data: GuiaAbastecimento) {
    return client.post(`${API_URL}/`, data)
  },

  atualizar(id: number, data: GuiaAbastecimento) {
    return client.put(`${API_URL}/${id}/`, data)
  },

  deletar(id: number) {
    return client.delete(`${API_URL}/${id}/`)
  }

}