import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import DataTable from "../../components/DataTable"
import { lotacaoFormSchema } from "../../forms/lotacao.schema"
import { lotacaoApi } from "../../api/lotacaoApi"
import { usuarioApi } from "../../api/usuarioApi"
import { ROUTES } from "../../routes/routes"
import "../../assets/css/ListPage.css"

import type { Lotacao, Usuario } from "../../types/models"

export default function LotacaoListPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [items, setItems] = useState<Lotacao[]>([])
  const [me, setMe] = useState<Usuario | null>(null)

  const canWrite = Boolean(me?.is_staff || me?.can_write_frota)

  async function load() {
    const res = await lotacaoApi.listar({ ativa: "" })
    setItems(res.data)
  }

  useEffect(() => {
    load()
    usuarioApi.me().then((res) => setMe(res.data)).catch(() => setMe(null))
  }, [location.key])

  async function handleDelete(item: Lotacao) {
    if (!item.id) return
    await lotacaoApi.deletar(item.id)
    load()
  }

  return (
    <div className="list-page">
      <div className="list-header">
        <div>
          <h2 className="list-title">Lotações</h2>
          <p className="list-subtitle">Vínculos entre condutor, rota e veículo.</p>
        </div>

        <div className="list-actions">
          {canWrite && (
            <Link className="list-create" to={ROUTES.LOTACOES_CREATE}>
              <span className="plus">+</span> Nova lotação
            </Link>
          )}
        </div>
      </div>

      <DataTable
        data={items}
        schema={lotacaoFormSchema}
        canEdit={canWrite}
        canDelete={canWrite}
        onEdit={(item) => navigate(ROUTES.LOTACOES_EDIT(item.id!))}
        onDelete={handleDelete}
      />
    </div>
  )
}
