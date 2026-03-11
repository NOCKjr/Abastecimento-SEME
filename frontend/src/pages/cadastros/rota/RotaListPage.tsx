import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { rotaApi } from "../../../api/rotaApi"

import { Link } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Rota } from "../../../types/models"
import { rotaFormSchema } from "../../../forms/rota.schema"

export default function RotaListPage() {

  const [rotas, setRotas] =
    useState<Rota[]>([])

  async function load() {
    const response = await rotaApi.listar()
    setRotas(response.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(item: Rota) {

    if (!item.id) return

    await rotaApi.deletar(item.id)
    load()
  }

  return (

    <div>

      <h2>Rotas</h2>

      <Link to={ROUTES.ROTA_CREATE}>
        Nova Rota
      </Link>

      <DataTable
        data={rotas}
        schema={rotaFormSchema}
        onEdit={(item) =>
          window.location.href =
            ROUTES.ROTA_EDIT(item.id!)
        }
        onDelete={handleDelete}
      />

    </div>

  )
}