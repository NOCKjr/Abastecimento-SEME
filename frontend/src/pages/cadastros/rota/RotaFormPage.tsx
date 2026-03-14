import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import DynamicForm from "../../../components/DynamicForm"
import { rotaFormSchema } from "../../../forms/rota.schema"
import { rotaApi } from "../../../api/rotaApi"
import "../../../assets/css/FormPage.css"

import type { Rota } from "../../../types/models"

export default function RotaFormPage() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [data, setData] =
    useState<Rota | null>(null)

  useEffect(() => {

    if (id) {
      rotaApi.buscar(Number(id))
        .then(res => setData(res.data))
    }

  }, [id])

  async function handleSubmit(form: Rota) {

    if (id) {

      await rotaApi.atualizar(
        Number(id),
        form
      )

    } else {

      await rotaApi.criar(form)

    }

    navigate("/cadastros/rotas")
  }

  return (

    <div className="form-page">

      <div className="form-header rota">
        <h2>
          {id ? "Editar" : "Nova"} Rota
        </h2>
      </div>

      <div className="form-container">
        <DynamicForm<Rota>
          schema={rotaFormSchema}
          initialData={data || {}}
          onSubmit={handleSubmit}
        />
      </div>

    </div>
  )
}