import { client } from "./client"
import type { Rota } from "../types/models"

const API_URL = "/cadastros/rotas"

export const rotaApi = {

  listar() {
    return client.get<Rota[]>(`${API_URL}/`)
  },
  
  buscar(id: number) {
    return client.get<Rota>(`${API_URL}/${id}/`)
  },

  criar(data: Rota) {
    return client.post(`${API_URL}/`, data)
  },

  atualizar(id: number, data: Rota) {
    return client.put(`${API_URL}/${id}/`, data)
  },

  deletar(id: number) {
    return client.delete(`${API_URL}/${id}/`)
  }

}