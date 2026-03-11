import { useEffect, useState } from "react"

import DataTable from "../../components/DataTable"
import { usuarioApi } from "../../api/usuarioApi"

import { Link } from "react-router-dom"
import { ROUTES } from "../../routes/routes"

import type { Usuario } from "../../types/models"
import { usuarioFormSchema } from "../../forms/usuario.schema"

export default function UsuarioListPage() {

  const [usuarios, setUsuarios] =
    useState<Usuario[]>([])

  async function load() {
    const response = await usuarioApi.listar()
    setUsuarios(response.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(item: Usuario) {

    if (!item.id) return

    await usuarioApi.deletar(item.id)
    load()
  }

  return (

    <div>

      <h2>Usuários</h2>

      <Link to={ROUTES.USUARIO_CREATE}>
        Nova Usuário
      </Link>

      <DataTable
        data={usuarios}
        schema={usuarioFormSchema}
        onEdit={(item) =>
          window.location.href =
            ROUTES.USUARIO_EDIT(item.id!)
        }
        onDelete={handleDelete}
      />

    </div>

  )
}