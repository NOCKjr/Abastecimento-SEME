import type { FormSchema } from "../types/form"

export const guiaAbastecimentoFormSchema: FormSchema = {
  fields: [
    {
      name: "data_emissao",
      label: "Data",
      type: "date",
      required: true
    },
    {
      name: "tipo_servico",
      label: "Tipo de Serviço",
      type: "text",
      required: true
    },
    {
      name: "tipo_combustivel",
      label: "Tipo de Combustível",
      type: "text",
      required: true
    },
    {
      name: "qtd_combustivel",
      label: "Quantidade de Combustível",
      type: "number",
      required: true
    },
    {
      name: "qtd_oleo_lubrificante",
      label: "Quantidade de Óleo Lubrificante",
      type: "number",
      required: true
    },
    {
      name: "hodometro",
      label: "Hodômetro",
      type: "number",
      required: false
    },
    {
      name: "observacao",
      label: "Observação",
      type: "textarea",
      required: false
    },

    // IDs de tabelas estrangeiras (Foreign Keys)
    {
      name: "condutor",
      label: "Condutor",
      type: "select",
      required: true,
      endpoint: "frota/condutores/",
      optionLabel: "nome_completo"
    },
    {
      name: "instituicao",
      label: "Instituição",
      type: "select",
      required: true,
      endpoint: "cadastros/instituicoes/",
      optionLabel: "nome"
    },
    {
      name: "rota",
      label: "Rota",
      type: "select",
      required: true,
      endpoint: "cadastros/rotas/",
      optionLabel: "sigla"
    },
    {
      name: "secretaria",
      label: "Secretaria",
      type: "select",
      required: true,
      endpoint: "cadastros/secretarias/",
      optionLabel: "sigla"
    },
    {
      name: "usuario",
      label: "Usuário",
      type: "select",
      required: true,
      endpoint: "usuarios/",
      optionLabel: "nome"
    },
    {
      name: "veiculo",
      label: "Veículo",
      type: "select",
      required: true,
      endpoint: "frota/veiculos/",
      optionLabel: "placa"
    },
  ]
}