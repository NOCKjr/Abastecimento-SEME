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
  },

  me() {
    return client.get<Usuario>(`${API_URL}/me/`)
  },

  atualizarMe(data: Partial<Pick<Usuario, "cpf" | "first_name" | "last_name" | "email" | "password">>) {
    return client.patch<Usuario>(`${API_URL}/me/`, data)
  },

  listarPermissoes() {
    return client.get<Usuario[]>(`${API_URL}/permissions/`)
  },

  atualizarPermissoes(id: number, data: Partial<Usuario>) {
    return client.patch<Usuario>(`${API_URL}/${id}/permissions/`, data)
  },

  registrar(data: Pick<Usuario, "cpf" | "password" | "first_name" | "last_name" | "email">) {
    return client.post<Usuario>(`${API_URL}/register/`, data)
  },

}
