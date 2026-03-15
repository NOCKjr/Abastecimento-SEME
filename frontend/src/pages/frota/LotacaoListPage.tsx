import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import DataTable from "../../components/DataTable"
import { lotacaoFormSchema } from "../../forms/lotacao.schema"
import { lotacaoApi } from "../../api/lotacaoApi"
import { ROUTES } from "../../routes/routes"

import type { Lotacao } from "../../types/models"

export default function LotacaoListPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Lotacao[]>([])

  async function load() {
    const res = await lotacaoApi.listar()
    setItems(res.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(item: Lotacao) {
    if (!item.id) return
    await lotacaoApi.deletar(item.id)
    load()
  }

  return (
    <div>
      <h2>Lotações</h2>

      <Link to={ROUTES.LOTACOES_CREATE}>Nova Lotação</Link>

      <DataTable
        data={items}
        schema={lotacaoFormSchema}
        onEdit={(item) => navigate(ROUTES.LOTACOES_EDIT(item.id!))}
        onDelete={handleDelete}
      />
    </div>
  )
}

