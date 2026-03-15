import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { condutorApi } from "../../../api/condutorApi"
import { usuarioApi } from "../../../api/usuarioApi"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Condutor, Usuario } from "../../../types/models"
import { condutorFormSchema } from "../../../forms/condutor.schema"
import "../../../assets/css/ListPage.css"

export default function CondutorListPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const [condutors, setInstituicoes] =
    useState<Condutor[]>([])
  const [me, setMe] = useState<Usuario | null>(null)

  const canWrite = Boolean(me?.is_staff || me?.can_write_frota)

  async function load() {
    const response = await condutorApi.listar({ ativo: "" })
    setInstituicoes(response.data)
  }

  useEffect(() => {
    load()
    usuarioApi.me().then((res) => setMe(res.data)).catch(() => setMe(null))
  }, [location.key])

  async function handleDelete(item: Condutor) {

    if (!item.id) return

    await condutorApi.deletar(item.id)
    load()
  }

  return (

    <div className="list-page">

      <div className="list-header">
        <div>
          <h2 className="list-title">Condutores</h2>
          <p className="list-subtitle">Cadastro e consulta de condutores.</p>
        </div>

        <div className="list-actions">
          {canWrite && (
            <Link className="list-create" to={ROUTES.CONDUTOR_CREATE}>
              <span className="plus">+</span> Novo condutor
            </Link>
          )}
        </div>
      </div>

      <DataTable
        data={condutors}
        schema={condutorFormSchema}
        canEdit={canWrite}
        canDelete={canWrite}
        onEdit={(item) => navigate(
          ROUTES.CONDUTOR_EDIT(item.id!)
        )}
        onDelete={handleDelete}
      />

    </div>

  )
}
