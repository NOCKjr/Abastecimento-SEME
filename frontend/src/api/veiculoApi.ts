import { client } from "./client"
import type { Veiculo } from "../types/models"

const API_URL = "/frota/veiculos"

export const veiculoApi = {

  listar() {
    return client.get<Veiculo[]>(`${API_URL}/`)
  },
  
  buscar(id: number) {
    return client.get<Veiculo>(`${API_URL}/${id}/`)
  },

  criar(data: Veiculo) {
    return client.post(`${API_URL}/`, data)
  },

  atualizar(id: number, data: Veiculo) {
    return client.put(`${API_URL}/${id}/`, data)
  },

  deletar(id: number) {
    return client.delete(`${API_URL}/${id}/`)
  }

}