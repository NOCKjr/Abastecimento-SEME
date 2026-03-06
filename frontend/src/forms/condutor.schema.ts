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
    },

    // IDs de tabelas estrangeiras (Foreign Keys)
    {
      name: "secretaria",
      label: "Secretaria",
      type: "select",
      required: true,
      endpoint: "cadastros/secretarias/",
      optionLabel: "sigla"
    }
  ]
}