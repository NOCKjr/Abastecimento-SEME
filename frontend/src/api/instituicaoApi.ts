import { client } from "./client"
import type { Instituicao } from "../types/models"

const API_URL = "/cadastros/instituicoes"

export const instituicaoApi = {

  listar() {
    return client.get<Instituicao[]>(`${API_URL}/`)
  },
  
  buscar(id: number) {
    return client.get<Instituicao>(`${API_URL}/${id}/`)
  },

  criar(data: Instituicao) {
    return client.post(`${API_URL}/`, data)
  },

  atualizar(id: number, data: Instituicao) {
    return client.put(`${API_URL}/${id}/`, data)
  },

  deletar(id: number) {
    return client.delete(`${API_URL}/${id}/`)
  }

}