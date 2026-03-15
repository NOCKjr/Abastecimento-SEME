// Formulário genérico para preenchimento (criar/editar) de dados

import { useEffect, useRef, useState } from "react"
import type { FormField, FormSchema } from "../types/form"
import { client } from "../api/client"

interface Props<T> {
  schema: FormSchema
  initialData?: Partial<T>
  onSubmit: (data: T) => void | Promise<void>
  onFieldChange?: (
    nextData: Partial<T>,
    change: { name: string; value: unknown; field?: FormField }
  ) => void | Partial<T> | Promise<void | Partial<T>>
}

// Cache global para as opções do select (se o campo for um select)
const selectCache: Record<string, Array<{ label: string; value: string | number }>> = {}

export default function DynamicForm<T>({
  schema,
  initialData = {} as Partial<T>,
  onSubmit,
  onFieldChange,
}: Props<T>) {

  const [formData, setFormData] =
    useState<Partial<T>>(initialData)

  const [selectOptions, setSelectOptions] =
    useState<Record<string, Array<{ label: string; value: string | number }>>>({})

  const changeSeqRef = useRef(0)

  // Quando os dados mudarem, atualiza o formulário
  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const dependencySignature = schema.fields
    .filter((field) => field.type === "select" && field.endpoint && field.dependsOn)
    .map((field) => {
      const dependencyValue = (formData as Record<string, unknown>)[field.dependsOn!]
      return `${field.name}:${String(dependencyValue ?? "")}`
    })
    .join("|")

  function buildCacheKey(field: FormField, dependencyValue?: string | number) {
    if (!field.endpoint) return ""
    if (!field.dependsOn || dependencyValue === undefined) return field.endpoint
    const paramName = field.dependsOnParam || field.dependsOn
    return `${field.endpoint}|${paramName}=${String(dependencyValue)}`
  }

  function isEmptyDependency(value: unknown) {
    return value === null || value === undefined || value === ""
  }

  function getInputValue(name: string) {
    const value = (formData as Record<string, unknown>)[name]
    return value ?? ""
  }

  // Carregar opções de selects via API
  useEffect(() => {

    async function loadOptions() {

      for (const field of schema.fields) {

        if (field.type !== "select" || !field.endpoint) {
          continue
        }

        let dependencyValue: string | number | undefined

        if (field.dependsOn) {
          const rawDependencyValue = (formData as Record<string, unknown>)[field.dependsOn]

          if (isEmptyDependency(rawDependencyValue)) {
            setSelectOptions((prev) => ({ ...prev, [field.name]: [] }))

            setFormData((prev) => {
              const previousValue = (prev as Record<string, unknown>)[field.name]
              if (previousValue === null || previousValue === undefined || previousValue === "") {
                return prev
              }
              return {
                ...prev,
                [field.name]: null,
              }
            })
            continue
          }

          dependencyValue = rawDependencyValue as string | number
        }

        const cacheKey = buildCacheKey(field, dependencyValue)

        if (selectCache[cacheKey]) {
          const cachedOptions = selectCache[cacheKey]

          setSelectOptions((prev) => ({
            ...prev,
            [field.name]: cachedOptions,
          }))

          const currentValue = (formData as Record<string, unknown>)[field.name]
          if (currentValue !== null && currentValue !== undefined && currentValue !== "") {
            const isCurrentValueValid = cachedOptions.some(
              (option: { label: string; value: string | number }) =>
                String(option.value) === String(currentValue)
            )

            if (!isCurrentValueValid) {
              setFormData((prev) => ({
                ...prev,
                [field.name]: null,
              }))
            }
          }

          continue
        }

        const params =
          field.dependsOn && dependencyValue !== undefined
            ? { [field.dependsOnParam || field.dependsOn]: dependencyValue }
            : undefined

        const res = await client.get(field.endpoint, { params })
        const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? [])

        const options: Array<{ label: string; value: string | number }> = data.map((item: Record<string, unknown>) => ({
          label: String(item[field.optionLabel || "nome"]),
          value: item[field.optionValue || "id"] as string | number,
        }))

        selectCache[cacheKey] = options

        setSelectOptions((prev) => ({
          ...prev,
          [field.name]: options,
        }))

        const currentValue = (formData as Record<string, unknown>)[field.name]
        if (currentValue !== null && currentValue !== undefined && currentValue !== "") {
          const isCurrentValueValid = options.some(
            (option: { label: string; value: string | number }) =>
              String(option.value) === String(currentValue)
          )

          if (!isCurrentValueValid) {
            setFormData((prev) => ({
              ...prev,
              [field.name]: null,
            }))
          }
        }
      }

    }

    loadOptions()

  }, [schema, dependencySignature])

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {

    const { name, value, type } = e.target
    const field = schema.fields.find((schemaField) => schemaField.name === name)
    let newValue: unknown =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value

    if (field?.type === "number" && value === "" && !field.required) {
      newValue = null
    }

    if (field?.type === "select" && value === "" && !field.required) {
      newValue = null
    }

    let nextData: Partial<T> | null = null
    setFormData((prev) => {
      nextData = {
        ...(prev as Record<string, unknown>),
        [name]: newValue,
      } as Partial<T>
      return nextData
    })

    if (onFieldChange && nextData) {
      const seq = ++changeSeqRef.current
      const maybePromise = onFieldChange(nextData, { name, value: newValue, field })
      Promise.resolve(maybePromise)
        .then((patch) => {
          if (!patch) return
          if (seq !== changeSeqRef.current) return
          setFormData((prev) => ({ ...prev, ...(patch as Partial<T>) }))
        })
        .catch(() => {
          // ignore
        })
    }

  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(formData as T)
  }

  function renderField(field: FormField) {

    switch (field.type) {

      case "textarea":
        return (
          <textarea
            className="form-textarea"
            name={field.name}
            required={field.required}
            value={String(getInputValue(field.name))}
            onChange={handleChange}
            placeholder={field.placeholder}
          />
        )

      case "select":
        return (
          <select
            className="form-select"
            name={field.name}
            required={field.required}
            value={String(getInputValue(field.name))}
            onChange={handleChange}
          >
            <option value="">Selecione</option>

            {(field.options || selectOptions[field.name])?.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </option>
            ))}
          </select>
        )

      case "checkbox":
        return (
          <input
            type="checkbox"
            className="form-input"
            name={field.name}
            checked={Boolean((formData as Record<string, unknown>)[field.name])}
            onChange={handleChange}
          />
        )

      default:
        return (
          <input
            className="form-input"
            type={field.type}
            name={field.name}
            required={field.required}
            value={String(getInputValue(field.name))}
            onChange={handleChange}
            placeholder={field.placeholder}
          />
        )
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      {schema.fields.map(field => (

        <div
          key={field.name}
          className="form-group"
        >

          <label className="form-label">
            {field.label}
          </label>

          {renderField(field)}

        </div>

      ))}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          💾 Salvar
        </button>
      </div>

    </form>
  )
}
