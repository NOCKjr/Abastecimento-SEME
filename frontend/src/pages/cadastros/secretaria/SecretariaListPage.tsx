import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { secretariaApi } from "../../../api/secretariaApi"

import { Link, useNavigate } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Secretaria } from "../../../types/models"
import { secretariaFormSchema } from "../../../forms/secretaria.schema"

export default function SecretariaListPage() {

  const navigate = useNavigate()

  const [secretarias, setSecretarias] =
    useState<Secretaria[]>([])

  async function load() {
    const response = await secretariaApi.listar()
    setSecretarias(response.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(item: Secretaria) {

    if (!item.id) return

    await secretariaApi.deletar(item.id)
    load()
  }

  return (

    <div>

      <h2>Secretarias</h2>

      <Link to={ROUTES.SECRETARIA_CREATE}>
        Nova Secretaria
      </Link>

      <DataTable
        data={secretarias}
        schema={secretariaFormSchema}
        onEdit={(item) => navigate(
          ROUTES.SECRETARIA_EDIT(item.id!)
        )}
        onDelete={handleDelete}
      />

    </div>

  )
}