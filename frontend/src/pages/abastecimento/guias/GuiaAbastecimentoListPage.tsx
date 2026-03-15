import { useEffect, useState } from "react"
import axios from "axios"

import DataTable from "../../../components/DataTable"
import { guiaAbastecimentoApi } from "../../../api/guiaAbastecimentoApi"

import { Link, useNavigate } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { GuiaAbastecimento } from "../../../types/models"
import { guiaAbastecimentoListSchema } from "../../../forms/guiaAbastecimento.schema"

export default function GuiaAbastecimentoListPage() {

  const navigate = useNavigate()

  const [guiasAbastecimento, setGuiasAbastecimento] =
    useState<GuiaAbastecimento[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function load() {
    const response = await guiaAbastecimentoApi.listar()
    setGuiasAbastecimento(response.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(item: GuiaAbastecimento) {

    if (!item.id) return

    await guiaAbastecimentoApi.deletar(item.id)
    load()
  }

  async function handlePdf(item: GuiaAbastecimento) {

    if (!item.id) {
      setErrorMessage("Nao foi possivel gerar o PDF: guia sem ID valido.")
      return
    }

    setErrorMessage(null)

    try {
      await guiaAbastecimentoApi.abrirPdfEmNovaAba(item.id)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setErrorMessage("Guia nao encontrada para gerar PDF.")
          return
        }

        if (error.response?.status === 500) {
          setErrorMessage("Erro interno ao gerar PDF. Tente novamente.")
          return
        }
      }

      setErrorMessage("Nao foi possivel gerar o PDF agora. Tente novamente.")
    }
  }

  return (

    <div>

      <h2>Guias de Abastecimento</h2>

      <Link to={ROUTES.GUIA_ABASTECIMENTO_CREATE}>
        Nova Guia de Abastecimento
      </Link>

      {errorMessage && <p>{errorMessage}</p>}

      <DataTable
        data={guiasAbastecimento}
        schema={guiaAbastecimentoListSchema}
        onPdf={handlePdf}
        onEdit={(item) => navigate(
          ROUTES.GUIA_ABASTECIMENTO_EDIT(item.id!)
        )}
        onDelete={handleDelete}
      />

    </div>

  )
}
