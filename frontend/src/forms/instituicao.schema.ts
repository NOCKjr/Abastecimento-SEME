import type { FormSchema } from "../types/form"

export const instituicaoFormSchema: FormSchema = {
  fields: [
    {
      name: "id",
      label: "ID",
      type: "number",
      hidden: true
    },
    {
      name: "nome",
      label: "Nome",
      type: "text",
      required: true
    },
    {
      name: "tipo",
      label: "Tipo",
      type: "text",
      required: true
    },

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
