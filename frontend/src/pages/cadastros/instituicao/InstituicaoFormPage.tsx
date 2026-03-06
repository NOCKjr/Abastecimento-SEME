import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import DynamicForm from "../../../components/DynamicForm"
import { instituicaoFormSchema } from "../../../forms/instituicao.schema"
import { instituicaoApi } from "../../../api/instituicaoApi"

import type { Instituicao } from "../../../types/models"

export default function InstituicaoFormPage() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [data, setData] =
    useState<Instituicao | null>(null)
  
  useEffect(() => {

    if (id) {
      instituicaoApi.buscar(Number(id))
        .then(res => setData(res.data))
    }

  }, [id])

  async function handleSubmit(form: Instituicao) {

    if (id) {

      await instituicaoApi.atualizar(
        Number(id),
        form
      )

    } else {

      await instituicaoApi.criar(form)

    }

    navigate("/cadastros/instituicoes")
  }

  return (

    <div>

      <h2>
        {id ? "Editar" : "Nova"} Instituicao
      </h2>

      <DynamicForm<Instituicao>
        schema={instituicaoFormSchema}
        initialData={data || {}}
        onSubmit={handleSubmit}
      />

    </div>
  )
}