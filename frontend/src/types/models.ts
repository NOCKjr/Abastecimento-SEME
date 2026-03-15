export interface Secretaria {
  id?: number
  nome: string
  sigla: string
}

export interface Rota {
  id?: number
  descricao: string
  secretaria?: number | null
  instituicao?: number | null
  distancia_km?: number | string
  consumo_medio?: number | string
  detalhes?: string
  ativa?: boolean
}

export interface Instituicao {
  id?: number
  nome: string
  tipo: string
  secretaria: number
}

export interface Condutor {
  id?: number
  nome_completo: string
  cpf: string
  secretaria: number
  ativo?: boolean
}

export interface Veiculo {
  id?: number
  placa: string
  modelo: string
  ano: number
  tipo_combustivel: string
  secretaria: number
}

export interface Lotacao {
  id?: number
  data: string
  ativa?: boolean
  condutor: number
  rota?: number | null
  veiculo?: number | null
}

export interface Usuario {
  id?: number
  first_name?: string
  last_name?: string
  email?: string
  cpf: string
  password?: string

  is_staff?: boolean
  is_superuser?: boolean

  can_write_cadastros?: boolean
  can_write_frota?: boolean
  can_create_guia_abastecimento?: boolean
  can_edit_guia_abastecimento?: boolean
  can_delete_guia_abastecimento?: boolean
}

export interface GuiaAbastecimento {
  // Identificação
  id?: number
  data_emissao: string
  tipo_servico: string
  
  // Combustível
  tipo_combustivel: string
  qtd_combustivel: number
  qtd_oleo_lubrificante?: number | null

  // Quilometragem
  hodometro?: number | null
  observacao: string
  
  // Foreign Keys
  condutor: number
  instituicao: number
  rota?: number | null
  secretaria: number
  usuario?: number
  usuario_nome?: string
  veiculo?: number | null
}
