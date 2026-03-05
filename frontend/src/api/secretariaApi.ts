import { client } from "./client"
import type { Secretaria } from "../types/models"

const API_URL = "/cadastros/secretarias"

export const secretariaApi = {

  listar() {
    return client.get<Secretaria[]>(API_URL)
  },

  criar(data: Secretaria) {
    return client.post(API_URL, data)
  },

  atualizar(id: number, data: Secretaria) {
    return client.put(`${API_URL}/${id}`, data)
  },

  deletar(id: number) {
    return client.delete(`${API_URL}/${id}`)
  }

}