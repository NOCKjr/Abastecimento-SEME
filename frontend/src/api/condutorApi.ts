import { client } from "./client"
import type { Condutor } from "../types/models"

const API_URL = "/frota/condutores"

export const condutorApi = {

  listar() {
    return client.get<Condutor[]>(`${API_URL}/`)
  },
  
  buscar(id: number) {
    return client.get<Condutor>(`${API_URL}/${id}/`)
  },

  criar(data: Condutor) {
    return client.post(`${API_URL}/`, data)
  },

  atualizar(id: number, data: Condutor) {
    return client.put(`${API_URL}/${id}/`, data)
  },

  deletar(id: number) {
    return client.delete(`${API_URL}/${id}/`)
  }

}