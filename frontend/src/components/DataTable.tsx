import { useEffect, useMemo, useState } from "react"
import { client } from "../api/client"
import type { FormField, FormSchema } from "../types/form"

interface Props<T> {
  data: T[]
  schema: FormSchema
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  onPdf?: (item: T) => void
}

type Option = { label: string; value: string | number }

const selectCache: Record<string, Option[]> = {}

export default function DataTable<T extends { id?: number }>({
  data,
  schema,
  onEdit,
  onDelete,
  onPdf,
}: Props<T>) {
  if (!data.length) return <p>Nenhum registro</p>

  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [endpointOptions, setEndpointOptions] = useState<Record<string, Option[]>>(
    {}
  )

  const fields = schema.fields.filter((f) => !f.hidden)

  useEffect(() => {
    async function loadSelectOptions() {
      const selectFields = fields.filter(
        (f) => f.type === "select" && f.endpoint && !f.options
      )

      for (const field of selectFields) {
        const endpoint = field.endpoint as string
        const labelKey = (field.displayLabel || field.optionLabel || "nome") as string
        const valueKey = (field.optionValue || "id") as string
        const cacheKey = `${endpoint}|label=${labelKey}|value=${valueKey}`
        const cached = selectCache[cacheKey]
        if (cached) {
          setEndpointOptions((prev) => ({ ...prev, [field.name]: cached }))
          continue
        }

        try {
          const res = await client.get(endpoint)
          const rows = Array.isArray(res.data) ? res.data : res.data?.results ?? []

          const options: Option[] = (rows as Array<Record<string, unknown>>).map(
            (item) => ({
              label: String(item[labelKey] ?? item[valueKey] ?? ""),
              value: item[valueKey] as string | number,
            })
          )

          selectCache[cacheKey] = options
          setEndpointOptions((prev) => ({ ...prev, [field.name]: options }))
        } catch {
          setEndpointOptions((prev) => ({ ...prev, [field.name]: [] }))
        }
      }
    }

    loadSelectOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema])

  function formatValue(field: FormField, value: any) {
    if (value === null || value === undefined) return ""

    if (field.type === "checkbox") return value ? "Sim" : "Não"

    if (field.type === "date") return new Date(value).toLocaleDateString()

    if (field.type === "select") {
      const options = field.options || endpointOptions[field.name]
      if (options?.length) {
        const opt = options.find((o) => String(o.value) === String(value))
        return opt?.label || value
      }
    }

    return value
  }

  const filtered = useMemo(() => {
    let result = data

    if (search) {
      result = result.filter((item) =>
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

  function handleSort(field: string) {
    if (sortField === field) setSortAsc(!sortAsc)
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
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            {fields.map((field) => (
              <th
                key={field.name}
                onClick={() => handleSort(field.name)}
                style={{ cursor: "pointer" }}
              >
                {field.label}
              </th>
            ))}
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              {fields.map((field) => (
                <td key={field.name}>
                  {formatValue(field, (item as any)[field.name])}
                </td>
              ))}

              <td>
                {onPdf && <button onClick={() => onPdf(item)}>PDF</button>}
                <button onClick={() => onEdit(item)}>Editar</button>
                <button onClick={() => onDelete(item)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
