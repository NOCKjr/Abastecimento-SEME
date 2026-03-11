import { useEffect, useState } from "react"

import DataTable from "../../../components/DataTable"
import { veiculoApi } from "../../../api/veiculoApi"

import { Link } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Veiculo } from "../../../types/models"
import { veiculoFormSchema } from "../../../forms/veiculo.schema"

export default function VeiculoListPage() {

  const [veiculos, setVeiculos] =
    useState<Veiculo[]>([])

  async function load() {
    const response = await veiculoApi.listar()
    setVeiculos(response.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(item: Veiculo) {

    if (!item.id) return

    await veiculoApi.deletar(item.id)
    load()
  }

  return (

    <div>

      <h2>Veiculo</h2>

      <Link to={ROUTES.VEICULO_CREATE}>
        Novo Veículo
      </Link>

      <DataTable
        data={veiculos}
        schema={veiculoFormSchema}
        onEdit={(item) =>
          window.location.href =
            ROUTES.VEICULO_EDIT(item.id!)
        }
        onDelete={handleDelete}
      />

    </div>

  )
}