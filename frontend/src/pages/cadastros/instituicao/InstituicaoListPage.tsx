import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { instituicaoApi } from "../../../api/instituicaoApi"

import { Link, useNavigate } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Instituicao } from "../../../types/models"
import { instituicaoFormSchema } from "../../../forms/instituicao.schema"

export default function InstituicaoListPage() {

  const navigate = useNavigate()

  const [instituicaos, setInstituicoes] =
    useState<Instituicao[]>([])

  async function load() {
    const response = await instituicaoApi.listar()
    setInstituicoes(response.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(item: Instituicao) {

    if (!item.id) return

    await instituicaoApi.deletar(item.id)
    load()
  }

  return (

    <div>

      <h2>Instituições</h2>

      <Link to={ROUTES.INSTITUICAO_CREATE}>
        Nova Instituição
      </Link>

      <DataTable
        data={instituicaos}
        schema={instituicaoFormSchema}
        onEdit={(item) => navigate(
          ROUTES.INSTITUICAO_EDIT(item.id!)
        )}
        onDelete={handleDelete}
      />

    </div>

  )
}