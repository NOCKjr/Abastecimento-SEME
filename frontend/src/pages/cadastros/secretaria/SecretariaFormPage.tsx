import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import DynamicForm from "../../../components/DynamicForm"
import { secretariaFormSchema } from "../../../forms/secretaria.schema"

import { secretariaApi } from "../../../api/secretariaApi"
import "../../../assets/css/FormPage.css"

import type { Secretaria } from "../../../types/models"

export default function SecretariaFormPage() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [data, setData] =
    useState<Secretaria | null>(null)

  useEffect(() => {

    if (id) {
      secretariaApi.buscar(Number(id))
        .then(res => setData(res.data))
    }

  }, [id])

  async function handleSubmit(form: Secretaria) {

    if (id) {

      await secretariaApi.atualizar(
        Number(id),
        form
      )

    } else {

      await secretariaApi.criar(form)

    }

    navigate("/cadastros/secretarias")
  }

  return (

    <div className="form-page">

      <div className="form-header secretaria">
        <h2>
          {id ? "Editar" : "Nova"} Secretaria
        </h2>
      </div>

      <div className="form-container">
        <DynamicForm<Secretaria>
          schema={secretariaFormSchema}
          initialData={data || {}}
          onSubmit={handleSubmit}
        />
      </div>

    </div>
  )
}