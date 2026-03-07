import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import DynamicForm from "../../components/DynamicForm"
import { usuarioFormSchema } from "../../forms/usuario.schema"
import { usuarioApi } from "../../api/usuarioApi"

import type { Usuario } from "../../types/models"

export default function UsuarioFormPage() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [data, setData] =
    useState<Usuario | null>(null)

  useEffect(() => {

    if (id) {
      usuarioApi.buscar(Number(id))
        .then(res => setData(res.data))
    }

  }, [id])

  async function handleSubmit(form: Usuario) {

    if (id) {

      await usuarioApi.atualizar(
        Number(id),
        form
      )

    } else {

      await usuarioApi.criar(form)

    }

    navigate("/usuarios")
  }

  return (

    <div>

      <h2>
        {id ? "Editar" : "Novo"} Usuário
      </h2>

      <DynamicForm<Usuario>
        schema={usuarioFormSchema}
        initialData={data || {}}
        onSubmit={handleSubmit}
      />

    </div>
  )
}