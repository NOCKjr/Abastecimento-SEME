import { useEffect, useMemo, useState } from "react"
import { client } from "../api/client"
import type { FormField, FormSchema } from "../types/form"
import "../assets/css/DataTable.css"

interface Props<T> {
  data: T[]
  schema: FormSchema
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  onPdf?: (item: T) => void
  canEdit?: boolean
  canDelete?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
}

type Option = { label: string; value: string | number }

const selectCache: Record<string, Option[]> = {}

const DECIMAL_FIELD_NAMES = new Set([
  "qtd_combustivel",
  "qtd_oleo_lubrificante",
  "distancia_km",
  "consumo_medio",
])

export default function DataTable<T extends { id?: number }>({
  data,
  schema,
  onEdit,
  onDelete,
  onPdf,
  canEdit = true,
  canDelete = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
}: Props<T>) {
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [endpointOptions, setEndpointOptions] = useState<Record<string, Option[]>>(
    {}
  )

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(pageSize)

  const fields = schema.fields.filter((f) => !f.hidden)

  useEffect(() => {
    setSearch("")
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

  useEffect(() => {
    setRowsPerPage(pageSize)
  }, [pageSize])

  useEffect(() => {
    setPage(1)
  }, [rowsPerPage])

  function formatDecimal(value: unknown) {
    if (value === null || value === undefined) return ""

    const raw = String(value).trim()
    if (!raw) return ""

    const match = raw.match(/^(-?\d+)(?:\.(\d+))?$/)
    if (!match) return raw

    const intPart = match[1]
    const decPart = match[2] ?? ""

    const trimmedDec = decPart.replace(/0+$/, "")
    const finalDec = trimmedDec.length >= 2 ? trimmedDec : trimmedDec.padEnd(2, "0")

    return `${intPart}.${finalDec}`
  }

  function formatValue(field: FormField, value: any) {
    if (value === null || value === undefined) return ""

    if (field.type === "checkbox") {
      const yes = Boolean(value)
      return <span className={`dt-badge ${yes ? "dt-badge-yes" : "dt-badge-no"}`}>{yes ? "Sim" : "Não"}</span>
    }

    if (field.type === "date") return new Date(value).toLocaleDateString()

    if (field.type === "number") {
      const shouldFormat =
        DECIMAL_FIELD_NAMES.has(field.name) ||
        (typeof value === "string" && value.includes(".")) ||
        (typeof value === "number" && Number.isFinite(value) && !Number.isInteger(value))

      if (shouldFormat) return formatDecimal(value)
    }

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

  useEffect(() => {
    setPage(1)
  }, [search, sortField, sortAsc, data])

  function handleSort(field: string) {
    if (sortField === field) setSortAsc(!sortAsc)
    else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const startIndex = (safePage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, total)
  const pageRows = filtered.slice(startIndex, endIndex)

  useEffect(() => {
    if (safePage !== page) setPage(safePage)
  }, [safePage, page])

  return (
    <div className="datatable">
      <div className="datatable-toolbar">
        <input
          className="datatable-search"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="datatable-tablewrap">
        <table className="datatable-table">
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field.name} onClick={() => handleSort(field.name)}>
                  {field.label}
                  {sortField === field.name && (
                    <span className="dt-sort">{sortAsc ? "▲" : "▼"}</span>
                  )}
                </th>
              ))}
              <th style={{ cursor: "default" }}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {pageRows.length ? (
              pageRows.map((item) => (
                <tr key={item.id}>
                  {fields.map((field) => (
                    <td key={field.name}>
                      {formatValue(field, (item as any)[field.name])}
                    </td>
                  ))}

                  <td>
                    <div className="dt-actions">
                      {onPdf && (
                        <button
                          type="button"
                          className="dt-action dt-action-pdf"
                          onClick={() => onPdf(item)}
                          aria-label="Abrir PDF"
                          title="PDF"
                        >
                          <span aria-hidden="true">📄</span>
                        </button>
                      )}
                      {canEdit && (
                        <button
                          type="button"
                          className="dt-action dt-action-edit"
                          onClick={() => onEdit(item)}
                          aria-label="Editar"
                          title="Editar"
                        >
                          <span aria-hidden="true">✏️</span>
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          className="dt-action dt-action-delete"
                          onClick={() => onDelete(item)}
                          aria-label="Excluir"
                          title="Excluir"
                        >
                          <span aria-hidden="true">🗑️</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={fields.length + 1}>
                  <p style={{ padding: 12 }}>{data.length ? "Nenhum registro" : "Sem dados"}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="datatable-footer">
        <span style={{ fontSize: 12 }}>
          {total ? `Mostrando ${startIndex + 1}-${endIndex} de ${total}` : "0 registros"}
        </span>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: 12 }}>
            Por página:&nbsp;
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <div className="dt-page">
            <button type="button" onClick={() => setPage(1)} disabled={safePage <= 1}>
              «
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
            >
              Anterior
            </button>
            <span style={{ fontSize: 12 }}>
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
            >
              Próxima
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={safePage >= totalPages}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
