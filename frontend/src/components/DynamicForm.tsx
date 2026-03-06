// Formulário genérico para preenchimento (criar/editar) de dados

import { useEffect, useState } from "react"
import type { FormSchema } from "../types/form"
import { client } from "../api/client"

interface Props<T> {
  schema: FormSchema
  initialData?: Partial<T>
  onSubmit: (data: T) => void | Promise<void>
}

// Cache global para as opções do select (se o campo for um select)
const selectCache: Record<string, any[]> = {}

export default function DynamicForm<T>({
  schema,
  initialData = {} as Partial<T>,
  onSubmit
}: Props<T>) {

  const [formData, setFormData] =
    useState<Partial<T>>(initialData)

  const [selectOptions, setSelectOptions] =
    useState<Record<string, any[]>>({})

  // Quando os dados mudarem, atualiza o formulário
  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  // Carregar opções de selects via API
  useEffect(() => {

    async function loadOptions() {

      for (const field of schema.fields) {

        if (field.type === "select" && field.endpoint) {

          // se já existe cache
          if (selectCache[field.endpoint]) {

            setSelectOptions(prev => ({
              ...prev,
              [field.name]: selectCache[field.endpoint!]
            }))

            continue
          }

          // senão busca da API
          const res = await client.get(field.endpoint)

          const options = res.data.map((item: any) => ({
            label: item[field.optionLabel || "nome"],
            value: item[field.optionValue || "id"]
          }))

          // salva no cache
          selectCache[field.endpoint] = options

          setSelectOptions(prev => ({
            ...prev,
            [field.name]: options
          }))

        }

      }

    }

    loadOptions()

  }, [schema])

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {

    const { name, value, type } = e.target

    const newValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value

    setFormData({
      ...formData,
      [name]: newValue
    })

  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(formData as T)
  }

  function renderField(field: any) {

    switch (field.type) {

      case "textarea":
        return (
          <textarea
            name={field.name}
            required={field.required}
            value={(formData as any)[field.name] || ""}
            onChange={handleChange}
          />
        )

      case "select":
        return (
          <select
            name={field.name}
            required={field.required}
            value={(formData as any)[field.name] || ""}
            onChange={handleChange}
          >
            <option value="">Selecione</option>

            {(field.options || selectOptions[field.name])?.map((opt: any) => (
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
            name={field.name}
            checked={(formData as any)[field.name] || false}
            onChange={handleChange}
          />
        )

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            required={field.required}
            value={(formData as any)[field.name] || ""}
            onChange={handleChange}
          />
        )
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      {schema.fields.map(field => (

        <div
          key={field.name}
          className="form-field"
        >

          <label>
            {field.label}
          </label>

          {renderField(field)}

        </div>

      ))}

      <button type="submit">
        Salvar
      </button>

    </form>
  )
}