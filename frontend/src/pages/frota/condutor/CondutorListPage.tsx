import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { condutorApi } from "../../../api/condutorApi"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Condutor } from "../../../types/models"
import { condutorFormSchema } from "../../../forms/condutor.schema"

export default function CondutorListPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const [condutors, setInstituicoes] =
    useState<Condutor[]>([])

  async function load() {
    const response = await condutorApi.listar()
    setInstituicoes(response.data)
  }

  useEffect(() => {
    load()
  }, [location.key])

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
        schema={condutorFormSchema}
        onEdit={(item) => navigate(
          ROUTES.CONDUTOR_EDIT(item.id!)
        )}
        onDelete={handleDelete}
      />

    </div>

  )
}
