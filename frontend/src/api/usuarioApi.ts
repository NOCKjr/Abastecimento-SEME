import { client } from "./client"
import type { Usuario } from "../types/models"

const API_URL = "/usuarios"

export const usuarioApi = {

  listar() {
    return client.get<Usuario[]>(`${API_URL}/`)
  },
  
  buscar(id: number) {
    return client.get<Usuario>(`${API_URL}/${id}/`)
  },

  criar(data: Usuario) {
    return client.post(`${API_URL}/`, data)
  },

  atualizar(id: number, data: Usuario) {
    return client.put(`${API_URL}/${id}/`, data)
  },

  deletar(id: number) {
    return client.delete(`${API_URL}/${id}/`)
  }

}