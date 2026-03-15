import type { FormSchema } from "../types/form"

export const usuarioFormSchema: FormSchema = {
  fields: [
    {
      name: "first_name",
      label: "Primeiro nome",
      type: "text",
      required: false,
    },
    {
      name: "last_name",
      label: "Sobrenome",
      type: "text",
      required: false,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      required: false,
    },
    {
      name: "cpf",
      label: "CPF",
      type: "text",
      required: true,
    },
    {
      name: "password",
      label: "Senha",
      type: "text",
      required: false,
    },
  ],
}

