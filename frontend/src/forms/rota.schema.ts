import type { FormSchema } from "../types/form"

export const rotaFormSchema: FormSchema = {
  fields: [
    {
      name: "descricao",
      label: "Descrição",
      type: "text",
      required: true,
    },
    {
      name: "secretaria",
      label: "Secretaria",
      type: "select",
      required: true,
      endpoint: "cadastros/secretarias/",
      optionLabel: "sigla",
    },
    {
      name: "instituicao",
      label: "Instituição",
      type: "select",
      required: true,
      endpoint: "cadastros/instituicoes/",
      optionLabel: "nome",
      dependsOn: "secretaria",
      dependsOnParam: "secretaria",
    },
    {
      name: "distancia_km",
      label: "Distância do percurso (km)",
      type: "number",
      required: true,
    },
    {
      name: "consumo_medio",
      label: "Consumo médio (L)",
      type: "number",
      required: true,
    },
    {
      name: "detalhes",
      label: "Descrição (detalhes)",
      type: "textarea",
      required: false,
    },
    {
      name: "ativa",
      label: "Ativa",
      type: "checkbox",
      required: false,
    },
  ],
}

