import type { FormSchema } from "../types/form"

export const secretariaFormSchema: FormSchema = {
  fields: [
    {
      name: "nome",
      label: "Nome",
      type: "text",
      required: true
    },
    {
      name: "sigla",
      label: "Sigla",
      type: "text",
      required: true
    }
  ]
}