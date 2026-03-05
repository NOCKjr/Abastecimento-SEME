import { useEffect, useState } from "react"

import DynamicForm from "../../../components/DynamicForm"
import DataTable from "../../../components/DataTable"

import { secretariaFormSchema } from "../../../forms/secretaria.schema"

import { secretariaApi } from "../../../api/secretariaApi"

import { Link } from "react-router-dom"
import { ROUTES } from "../../../routes/routes"

import type { Secretaria } from "../../../types/models"

export default function SecretariaPage() {

  const [secretarias, setSecretarias] =
    useState<Secretaria[]>([])

  const [editItem, setEditItem] =
    useState<Secretaria | null>(null)

  async function load() {
    const response = await secretariaApi.listar()
    setSecretarias(response.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(data: Secretaria) {

    if (editItem?.id) {

      await secretariaApi.atualizar(editItem.id, data)

    } else {

      await secretariaApi.criar(data)

    }

    setEditItem(null)
    load()
  }

  async function handleDelete(item: Secretaria) {

    if (!item.id) return

    await secretariaApi.deletar(item.id)
    load()
  }

  return (
    <div>
      <h2>Secretarias</h2>

      <DynamicForm
        schema={secretariaFormSchema}
        initialData={editItem || {}}
        onSubmit={handleSubmit}
      />

      <DataTable
        data={secretarias}
        onEdit={setEditItem}
        onDelete={handleDelete}
      />

    </div>

  )
}