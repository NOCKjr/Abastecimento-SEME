import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import DynamicForm from "../../../components/DynamicForm"
import { condutorFormSchema } from "../../../forms/condutor.schema"
import { condutorApi } from "../../../api/condutorApi"

import type { Condutor } from "../../../types/models"

export default function CondutorFormPage() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [data, setData] =
    useState<Condutor | null>(null)
  
  useEffect(() => {

    if (id) {
      condutorApi.buscar(Number(id))
        .then(res => setData(res.data))
    }

  }, [id])

  async function handleSubmit(form: Condutor) {

    if (id) {

      await condutorApi.atualizar(
        Number(id),
        form
      )

    } else {

      await condutorApi.criar(form)

    }

    navigate("/frota/condutores")
  }

  return (

    <div>

      <h2>
        {id ? "Editar" : "Novo"} Condutor
      </h2>

      <DynamicForm<Condutor>
        schema={condutorFormSchema}
        initialData={data || {}}
        onSubmit={handleSubmit}
      />

    </div>
  )
}