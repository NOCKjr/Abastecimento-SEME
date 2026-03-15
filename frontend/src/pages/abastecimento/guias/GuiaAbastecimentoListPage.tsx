import { useEffect, useState } from "react"
import axios from "axios"

import DataTable from "../../../components/DataTable"
import { guiaAbastecimentoApi } from "../../../api/guiaAbastecimentoApi"
import { usuarioApi } from "../../../api/usuarioApi"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { GuiaAbastecimento, Usuario } from "../../../types/models"
import { guiaAbastecimentoListSchema } from "../../../forms/guiaAbastecimento.schema"
import "../../../assets/css/ListPage.css"

export default function GuiaAbastecimentoListPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const [me, setMe] = useState<Usuario | null>(null)
  const [guiasAbastecimento, setGuiasAbastecimento] =
    useState<GuiaAbastecimento[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const canCreate = Boolean(me?.is_staff || me?.can_create_guia_abastecimento)
  const canEdit = Boolean(me?.is_staff || me?.can_edit_guia_abastecimento)
  const canDelete = Boolean(me?.is_staff || me?.can_delete_guia_abastecimento)

  async function load() {
    const response = await guiaAbastecimentoApi.listar()
    setGuiasAbastecimento(response.data)
  }

  useEffect(() => {
    load()
    usuarioApi.me().then((res) => setMe(res.data)).catch(() => setMe(null))
  }, [location.key])

  async function handleDelete(item: GuiaAbastecimento) {

    if (!item.id) return

    await guiaAbastecimentoApi.deletar(item.id)
    load()
  }

  async function handlePdf(item: GuiaAbastecimento) {

    if (!item.id) {
      setErrorMessage("Não foi possível gerar o PDF: guia sem ID válido.")
      return
    }

    setErrorMessage(null)

    try {
      await guiaAbastecimentoApi.abrirPdfEmNovaAba(item.id)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setErrorMessage("Guia não encontrada para gerar PDF.")
          return
        }

        if (error.response?.status === 500) {
          setErrorMessage("Erro interno ao gerar PDF. Tente novamente.")
          return
        }
      }

      setErrorMessage("Não foi possível gerar o PDF agora. Tente novamente.")
    }
  }

  return (

    <div className="list-page">

      <div className="list-header">
        <div>
          <h2 className="list-title">Guias de abastecimento</h2>
          <p className="list-subtitle">Listagem e exportação em PDF.</p>
        </div>

        <div className="list-actions">
          {canCreate && (
            <Link className="list-create" to={ROUTES.GUIA_ABASTECIMENTO_CREATE}>
              <span className="plus">+</span> Nova guia
            </Link>
          )}
        </div>
      </div>

      {errorMessage && <p style={{ color: "#b91c1c", fontWeight: 700 }}>{errorMessage}</p>}

      <DataTable
        data={guiasAbastecimento}
        schema={guiaAbastecimentoListSchema}
        onPdf={handlePdf}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={(item) => navigate(
          ROUTES.GUIA_ABASTECIMENTO_EDIT(item.id!)
        )}
        onDelete={handleDelete}
      />

    </div>

  )
}

