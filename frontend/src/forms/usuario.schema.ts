import type { FormSchema } from "../types/form"

export const usuarioFormSchema: FormSchema = {
  fields: [
    {
      name: "nome",
      label: "Nome",
      type: "text",
      required: true
    },
    {
      name: "cpf",
      label: "CPF",
      type: "text",
      required: true
    },
    {
      name: "senha",
      label: "Senha",
      type: "text",
      required: true
    }
  ]
}