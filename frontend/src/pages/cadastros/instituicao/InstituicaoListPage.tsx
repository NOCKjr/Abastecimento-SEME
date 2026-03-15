import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { instituicaoApi } from "../../../api/instituicaoApi"
import { usuarioApi } from "../../../api/usuarioApi"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Instituicao, Usuario } from "../../../types/models"
import { instituicaoFormSchema } from "../../../forms/instituicao.schema"
import "../../../assets/css/ListPage.css"

export default function InstituicaoListPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const [instituicaos, setInstituicoes] =
    useState<Instituicao[]>([])
  const [me, setMe] = useState<Usuario | null>(null)

  const canWrite = Boolean(me?.is_staff || me?.can_write_cadastros)

  async function load() {
    const response = await instituicaoApi.listar()
    setInstituicoes(response.data)
  }

  useEffect(() => {
    load()
    usuarioApi.me().then((res) => setMe(res.data)).catch(() => setMe(null))
  }, [location.key])

  async function handleDelete(item: Instituicao) {

    if (!item.id) return

    await instituicaoApi.deletar(item.id)
    load()
  }

  return (

    <div className="list-page">

      <div className="list-header">
        <div>
          <h2 className="list-title">Instituições</h2>
          <p className="list-subtitle">Escolas, UPA, hospitais e outros.</p>
        </div>

        <div className="list-actions">
          {canWrite && (
            <Link className="list-create" to={ROUTES.INSTITUICAO_CREATE}>
              <span className="plus">+</span> Nova instituição
            </Link>
          )}
        </div>
      </div>

      <DataTable
        data={instituicaos}
        schema={instituicaoFormSchema}
        canEdit={canWrite}
        canDelete={canWrite}
        onEdit={(item) => navigate(
          ROUTES.INSTITUICAO_EDIT(item.id!)
        )}
        onDelete={handleDelete}
      />

    </div>

  )
}

