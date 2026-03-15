import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { rotaApi } from "../../../api/rotaApi"
import { usuarioApi } from "../../../api/usuarioApi"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Rota, Usuario } from "../../../types/models"
import { rotaFormSchema } from "../../../forms/rota.schema"
import "../../../assets/css/ListPage.css"

export default function RotaListPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const [rotas, setRotas] =
    useState<Rota[]>([])
  const [me, setMe] = useState<Usuario | null>(null)

  async function load() {
    const response = await rotaApi.listar({ ativa: "" })
    setRotas(response.data)
  }

  useEffect(() => {
    load()
    usuarioApi.me().then((res) => setMe(res.data)).catch(() => setMe(null))
  }, [location.key])

  async function handleDelete(item: Rota) {

    if (!item.id) return

    await rotaApi.deletar(item.id)
    load()
  }

  return (

    <div className="list-page">
      <div className="list-header">
        <div>
          <h2 className="list-title">Rotas</h2>
          <p className="list-subtitle">Rotas ativas e inativas cadastradas.</p>
        </div>

        <div className="list-actions">
          {(me?.is_staff || me?.can_write_cadastros) && (
            <Link className="list-create" to={ROUTES.ROTA_CREATE}>
              <span className="plus">+</span> Nova rota
            </Link>
          )}
        </div>
      </div>

      <DataTable
        data={rotas}
        schema={rotaFormSchema}
        canEdit={Boolean(me?.is_staff || me?.can_write_cadastros)}
        canDelete={Boolean(me?.is_staff || me?.can_write_cadastros)}
        onEdit={(item) => navigate(ROUTES.ROTA_EDIT(item.id!))}
        onDelete={handleDelete}
      />

    </div>

  )
}
