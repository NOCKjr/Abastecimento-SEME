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
  },

  baixarPdf(id: number) {
    return client.get<Blob>(`${API_URL}/${id}/pdf/`, {
      responseType: "blob"
    })
  },

  async abrirPdfEmNovaAba(id: number) {
    const response = await this.baixarPdf(id)
    const blob = new Blob([response.data], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)

    try {
      const openedWindow = window.open(url, "_blank")

      if (!openedWindow) {
        const link = document.createElement("a")
        link.href = url
        link.download = `guia_abastecimento_${id}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  },

  urlPdf(id: number): string {
    return `${client.defaults.baseURL}${API_URL}/${id}/pdf/`
  }

}