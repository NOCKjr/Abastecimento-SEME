import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

import DynamicForm from "../../../components/DynamicForm"
import { guiaAbastecimentoFormSchema } from "../../../forms/guiaAbastecimento.schema"
import { guiaAbastecimentoApi } from "../../../api/guiaAbastecimentoApi"
import "../../../assets/css/FormPage.css"
import { lotacaoApi } from "../../../api/lotacaoApi"

import type { GuiaAbastecimento } from "../../../types/models"

export default function GuiaAbastecimentoFormPage() {

  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const [data, setData] =
    useState<GuiaAbastecimento | null>(null)

  const secretariaParam = searchParams.get("secretaria")
  const secretariaId = secretariaParam ? Number(secretariaParam) : undefined

  const today = (() => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  })()
  
  useEffect(() => {

    if (id) {
      guiaAbastecimentoApi.buscar(Number(id))
        .then(res => setData(res.data))
    }

  }, [id])

  async function handleSubmit(form: GuiaAbastecimento) {

    if (id) {

      await guiaAbastecimentoApi.atualizar(
        Number(id),
        form
      )

    } else {

      await guiaAbastecimentoApi.criar(form)

    }

    navigate("/abastecimento/guias")
  }

  return (

    <div className="form-page">

      <div className="form-header">
        <h2>
          {id ? "Editar" : "Nova"} Guia de Abastecimento
        </h2>
      </div>

      <div className="form-container">
        <DynamicForm<GuiaAbastecimento>
          schema={guiaAbastecimentoFormSchema}
          initialData={
            id
              ? (data || {})
              : {
                data_emissao: today,
                qtd_oleo_lubrificante: 0,
                observacao: "",
                ...(typeof secretariaId === "number" && Number.isFinite(secretariaId)
                  ? { secretaria: secretariaId }
                  : {}),
                ...(data || {}),
              }
          }
          onSubmit={handleSubmit}
          onFieldChange={async (nextData, change) => {
            const shouldFetch =
              change.name === "condutor" || change.name === "data_emissao"

            if (!shouldFetch) return

            const dataRecord = nextData as Record<string, unknown>
            const condutorId = Number(dataRecord.condutor)
            if (!Number.isFinite(condutorId) || !condutorId) return

            const dataEmissao = String(dataRecord.data_emissao || "")
            const res = await lotacaoApi.lotacaoAtual(condutorId, dataEmissao || undefined)
            const lotacao = res.data.lotacao
            if (!lotacao) return

            const patch: Partial<GuiaAbastecimento> = {}
            patch.secretaria = lotacao.secretaria
            if (lotacao.rota != null) patch.rota = lotacao.rota
            if (lotacao.instituicao != null) patch.instituicao = lotacao.instituicao
            if (lotacao.veiculo != null) patch.veiculo = lotacao.veiculo
            return patch
          }}
        />
      </div>

    </div>
  )
}
