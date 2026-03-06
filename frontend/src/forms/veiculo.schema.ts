import type { FormSchema } from "../types/form"

export const veiculoFormSchema: FormSchema = {
  fields: [
    {
      name: "placa",
      label: "Placa",
      type: "text",
      required: true
    },
    {
      name: "modelo",
      label: "Modelo",
      type: "text",
      required: true
    },
    {
      name: "ano",
      label: "Ano",
      type: "number",
      required: true
    },
    {
      name: "tipo_combustivel",
      label: "Tipo de Combustível",
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