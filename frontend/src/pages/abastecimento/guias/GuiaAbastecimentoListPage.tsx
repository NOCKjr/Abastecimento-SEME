import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { guiaAbastecimentoApi } from "../../../api/guiaAbastecimentoApi"

import { Link } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { GuiaAbastecimento } from "../../../types/models"
import { guiaAbastecimentoFormSchema } from "../../../forms/guiaAbastecimento.schema"

export default function GuiaAbastecimentoListPage() {

  const [guiasAbastecimento, setGuiasAbastecimento] =
    useState<GuiaAbastecimento[]>([])
  
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

  return (

    <div>

      <h2>Guias de Abastecimento</h2>

      <Link to={ROUTES.GUIA_ABASTECIMENTO_CREATE}>
        Nova Guia de Abastecimento
      </Link>

      <DataTable
        data={guiasAbastecimento}
        schema={guiaAbastecimentoFormSchema}
        onEdit={(item) =>
          window.location.href =
            ROUTES.GUIA_ABASTECIMENTO_EDIT(item.id!)
        }
        onDelete={handleDelete}
      />

    </div>

  )
}