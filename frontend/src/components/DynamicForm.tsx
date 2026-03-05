import { useState } from "react"
import type { FormSchema } from "../types/form"

interface Props {
  schema: FormSchema
  onSubmit: (data: Record<string, any>) => void
}

export default function DynamicForm({
  schema,
  onSubmit
}: Props) {

  const [formData, setFormData] =
    useState<Record<string, any>>({})

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>

      {schema.fields.map(field => (

        <div key={field.name} className="form-field">

          <label>
            {field.label}
          </label>

          <input
            type={field.type}
            name={field.name}
            required={field.required}
            onChange={handleChange}
          />

        </div>

      ))}

      <button type="submit">
        Salvar
      </button>

    </form>
  )
}