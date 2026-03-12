// Tabela genérica para listar dados

import { useMemo, useState } from "react"
import type { FormSchema } from "../types/form"

interface Props<T> {
  data: T[]
  schema: FormSchema
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  onPdf?: (item: T) => void
}

export default function DataTable<T extends { id?: number }>(
  { data, schema, onEdit, onDelete, onPdf }: Props<T>
) {

  // Lista vazia
  if (!data.length)
    return <p>Nenhum registro</p>

  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)

  const fields = schema.fields.filter(f => !f.hidden)

  // Formata o valor, dependento do tipo do campo ('field')
  function formatValue(field: any, value: any) {

    if (value === null || value === undefined)
      return ""

    if (field.type === "checkbox")
      return value ? "Sim" : "Não"

    if (field.type === "date")
      return new Date(value).toLocaleDateString()

    if (field.type === "select" && field.options) {

      const opt = field.options.find(
        (o: any) => o.value === value
      )

      return opt?.label || value
    }

    return value
  }

  // Dados filtrados. Usa 'useMemo' para evitar recalcular filtros
  const filtered = useMemo(() => {
    let result = data

    if (search) {
      result = result.filter(item =>
        Object.values(item as any)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    }

    if (sortField) {
      result = [...result].sort((a: any, b: any) => {
        if (a[sortField] < b[sortField]) return sortAsc ? -1 : 1
        if (a[sortField] > b[sortField]) return sortAsc ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, search, sortField, sortAsc])

  // Ordena os dados com base em 'field'
  function handleSort(field: string) {
    if (sortField === field)
      setSortAsc(!sortAsc)
    else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  return (
    <div>
      <input
        placeholder="Buscar..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table>

        <thead>
          <tr>
            {fields.map(field => (
                <th
                  key={field.name}
                  onClick={() =>
                    handleSort(field.name)
                  }
                  style={{ cursor: "pointer" }}>
                  {field.label}
                </th>
              ))}
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(item => (
            <tr key={item.id}>
              {fields.map(field => (
                <td key={field.name}>
                  {formatValue(
                    field,
                    (item as any)[field.name]
                  )}
                </td>
              ))}

              <td>
                {onPdf && (
                  <button
                    onClick={() => onPdf(item)}
                  >
                    PDF
                  </button>
                )}
                <button onClick={() => onEdit(item)}>
                  Editar
                </button>
                <button onClick={() => onDelete(item)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}