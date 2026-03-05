// Formulário genérico para preenchimento (criar/editar) de dados

import { useEffect, useState } from "react"
import type { FormSchema } from "../types/form"

interface Props<T> {
  schema: FormSchema
  initialData?: Partial<T>
  onSubmit: (data: T) => void | Promise<void>
}

export default function DynamicForm<T>({
  schema,
  initialData = {} as Partial<T>,
  onSubmit
}: Props<T>) {

  const [formData, setFormData] =
    useState<Partial<T>>(initialData)
  
  // Quando os dados mudarem, atualiza o formulário
  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

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

            {field.options?.map((opt: any) => (
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