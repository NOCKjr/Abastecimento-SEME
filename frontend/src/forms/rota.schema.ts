import type { FormSchema } from "../types/form"

export const rotaFormSchema: FormSchema = {
  fields: [
    {
      name: "descricao",
      label: "Descrição",
      type: "text",
      required: true
    }
  ]
}