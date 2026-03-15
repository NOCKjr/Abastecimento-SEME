import { useEffect, useState } from "react"

import DataTable from "../../components/DataTable"
import { usuarioApi } from "../../api/usuarioApi"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { ROUTES } from "../../routes/routes"

import type { Usuario } from "../../types/models"
import { usuarioFormSchema } from "../../forms/usuario.schema"
import "../../assets/css/ListPage.css"

export default function UsuarioListPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const [me, setMe] = useState<Usuario | null>(null)
  const [usuarios, setUsuarios] =
    useState<Usuario[]>([])

  const isAdmin = Boolean(me?.is_staff)

  async function load() {
    const response = await usuarioApi.listar()
    setUsuarios(response.data)
  }

  useEffect(() => {
    load()
    usuarioApi.me().then((res) => setMe(res.data)).catch(() => setMe(null))
  }, [location.key])

  async function handleDelete(item: Usuario) {

    if (!item.id) return

    await usuarioApi.deletar(item.id)
    load()
  }

  return (

    <div className="list-page">

      <div className="list-header">
        <div>
          <h2 className="list-title">Usuários</h2>
          <p className="list-subtitle">Cadastro e manutenção de usuários.</p>
        </div>

        <div className="list-actions">
          {isAdmin && (
            <Link className="list-create" to={ROUTES.USUARIO_CREATE}>
              <span className="plus">+</span> Novo usuário
            </Link>
          )}
        </div>
      </div>

      <DataTable
        data={usuarios}
        schema={usuarioFormSchema}
        canEdit={isAdmin}
        canDelete={isAdmin}
        onEdit={(item) => navigate(
          ROUTES.USUARIO_EDIT(item.id!)
        )}
        onDelete={handleDelete}
      />

    </div>

  )
}

