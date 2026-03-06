import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { condutorApi } from "../../../api/condutorApi"

import { Link } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Condutor } from "../../../types/models"

export default function CondutorListPage() {

  const [condutors, setInstituicoes] =
    useState<Condutor[]>([])

  async function load() {
    const response = await condutorApi.listar()
    setInstituicoes(response.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(item: Condutor) {

    if (!item.id) return

    await condutorApi.deletar(item.id)
    load()
  }

  return (

    <div>

      <h2>Condutor</h2>

      <Link to={ROUTES.CONDUTOR_CREATE}>
        Novo Condutor
      </Link>

      <DataTable
        data={condutors}
        onEdit={(item) =>
          window.location.href =
            ROUTES.CONDUTOR_EDIT(item.id!)
        }
        onDelete={handleDelete}
      />

    </div>

  )
}