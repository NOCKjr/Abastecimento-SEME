import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { secretariaApi } from "../../../api/secretariaApi"
import { usuarioApi } from "../../../api/usuarioApi"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Secretaria, Usuario } from "../../../types/models"
import { secretariaFormSchema } from "../../../forms/secretaria.schema"
import "../../../assets/css/ListPage.css"

export default function SecretariaListPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const [secretarias, setSecretarias] =
    useState<Secretaria[]>([])
  const [me, setMe] = useState<Usuario | null>(null)

  async function load() {
    const response = await secretariaApi.listar()
    setSecretarias(response.data)
  }

  useEffect(() => {
    load()
    usuarioApi.me().then((res) => setMe(res.data)).catch(() => setMe(null))
  }, [location.key])

  async function handleDelete(item: Secretaria) {

    if (!item.id) return

    await secretariaApi.deletar(item.id)
    load()
  }

  return (

    <div className="list-page">
      <div className="list-header">
        <div>
          <h2 className="list-title">Secretarias</h2>
          <p className="list-subtitle">Listagem de secretarias cadastradas.</p>
        </div>

        <div className="list-actions">
          {(me?.is_staff || me?.can_write_cadastros) && (
            <Link className="list-create" to={ROUTES.SECRETARIA_CREATE}>
              <span className="plus">+</span> Nova secretaria
            </Link>
          )}
        </div>
      </div>

      <DataTable
        data={secretarias}
        schema={secretariaFormSchema}
        canEdit={Boolean(me?.is_staff || me?.can_write_cadastros)}
        canDelete={Boolean(me?.is_staff || me?.can_write_cadastros)}
        onEdit={(item) => navigate(
          ROUTES.SECRETARIA_EDIT(item.id!)
        )}
        onDelete={handleDelete}
      />

    </div>

  )
}
