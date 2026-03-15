import type { FormSchema } from "../types/form"

export const lotacaoFormSchema: FormSchema = {
  fields: [
    {
      name: "data",
      label: "Data",
      type: "date",
      required: true,
    },
    {
      name: "condutor",
      label: "Condutor",
      type: "select",
      required: true,
      endpoint: "frota/condutores/",
      optionLabel: "nome_completo",
    },
    {
      name: "rota",
      label: "Rota",
      type: "select",
      required: true,
      endpoint: "cadastros/rotas/",
      optionLabel: "descricao",
      displayLabel: "id",
      dependsOn: "condutor",
      dependsOnParam: "condutor",
    },
    {
      name: "veiculo",
      label: "Veículo",
      type: "select",
      required: false,
      endpoint: "frota/veiculos/",
      optionLabel: "placa",
    },
    {
      name: "ativa",
      label: "Ativa",
      type: "checkbox",
      required: false,
    },
  ],
}
