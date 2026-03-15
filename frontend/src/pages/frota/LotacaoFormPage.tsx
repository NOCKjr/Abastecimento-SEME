import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import DynamicForm from "../../components/DynamicForm"
import { lotacaoFormSchema } from "../../forms/lotacao.schema"
import { lotacaoApi } from "../../api/lotacaoApi"
import "../../assets/css/FormPage.css"
import { ROUTES } from "../../routes/routes"

import type { Lotacao } from "../../types/models"

export default function LotacaoFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [data, setData] = useState<Lotacao | null>(null)

  const today = useMemo(() => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }, [])

  useEffect(() => {
    if (!id) return
    lotacaoApi.buscarPorId(Number(id)).then((res) => setData(res.data))
  }, [id])

  async function handleSubmit(form: Lotacao) {
    if (id) {
      await lotacaoApi.atualizar(Number(id), form)
    } else {
      await lotacaoApi.criar(form)
    }
    navigate(ROUTES.LOTACOES)
  }

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>{id ? "Editar" : "Nova"} Lotação</h2>
      </div>

      <div className="form-container">
        <DynamicForm<Lotacao>
          schema={lotacaoFormSchema}
          initialData={id ? (data || {}) : { data: today, ativa: true, ...(data || {}) }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
