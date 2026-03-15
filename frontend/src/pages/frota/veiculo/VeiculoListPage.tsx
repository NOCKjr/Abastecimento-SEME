import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { veiculoApi } from "../../../api/veiculoApi"
import { usuarioApi } from "../../../api/usuarioApi"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Usuario, Veiculo } from "../../../types/models"
import { veiculoFormSchema } from "../../../forms/veiculo.schema"
import "../../../assets/css/ListPage.css"

export default function VeiculoListPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const [veiculos, setVeiculos] =
    useState<Veiculo[]>([])
  const [me, setMe] = useState<Usuario | null>(null)

  const canWrite = Boolean(me?.is_staff || me?.can_write_frota)

  async function load() {
    const response = await veiculoApi.listar()
    setVeiculos(response.data)
  }

  useEffect(() => {
    load()
    usuarioApi.me().then((res) => setMe(res.data)).catch(() => setMe(null))
  }, [location.key])

  async function handleDelete(item: Veiculo) {

    if (!item.id) return

    await veiculoApi.deletar(item.id)
    load()
  }

  return (

    <div className="list-page">

      <div className="list-header">
        <div>
          <h2 className="list-title">Veículos</h2>
          <p className="list-subtitle">Frota cadastrada por secretaria.</p>
        </div>

        <div className="list-actions">
          {canWrite && (
            <Link className="list-create" to={ROUTES.VEICULO_CREATE}>
              <span className="plus">+</span> Novo veículo
            </Link>
          )}
        </div>
      </div>

      <DataTable
        data={veiculos}
        schema={veiculoFormSchema}
        canEdit={canWrite}
        canDelete={canWrite}
        onEdit={(item) => navigate(
          ROUTES.VEICULO_EDIT(item.id!)
        )}
        onDelete={handleDelete}
      />

    </div>

  )
}

