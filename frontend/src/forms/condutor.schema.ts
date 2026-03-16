import type { FormSchema } from "../types/form"

export const condutorFormSchema: FormSchema = {
  fields: [
    {
      name: "nome_completo",
      label: "Nome Completo",
      type: "text",
      required: true
    },
    {
      name: "cpf",
      label: "CPF",
      type: "text",
      required: true
    }
  ]
}