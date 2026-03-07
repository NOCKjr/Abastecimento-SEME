import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import DynamicForm from "../../../components/DynamicForm"
import { guiaAbastecimentoFormSchema } from "../../../forms/guiaAbastecimento.schema"
import { guiaAbastecimentoApi } from "../../../api/guiaAbastecimentoApi"

import type { GuiaAbastecimento } from "../../../types/models"

export default function GuiaAbastecimentoFormPage() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [data, setData] =
    useState<GuiaAbastecimento | null>(null)
  
  useEffect(() => {

    if (id) {
      guiaAbastecimentoApi.buscar(Number(id))
        .then(res => setData(res.data))
    }

  }, [id])

  async function handleSubmit(form: GuiaAbastecimento) {

    if (id) {

      await guiaAbastecimentoApi.atualizar(
        Number(id),
        form
      )

    } else {

      await guiaAbastecimentoApi.criar(form)

    }

    navigate("/abastecimento/guias")
  }

  return (

    <div>

      <h2>
        {id ? "Editar" : "Nova"} Guia de Abastecimento
      </h2>

      <DynamicForm<GuiaAbastecimento>
        schema={guiaAbastecimentoFormSchema}
        initialData={data || {}}
        onSubmit={handleSubmit}
      />

    </div>
  )
}