export interface Secretaria {
  id?: number
  nome: string
  sigla: string
}

export interface Rota {
  id?: number
  descricao: string
}

export interface Instituicao {
  id?: number
  nome: string
  tipo: string
  rota: number | null
  secretaria: number
}

export interface Condutor {
  id?: number
  nome_completo: string
  cpf: string
  secretaria: number
}

export interface Veiculo {
  id?: number
  placa: string
  modelo: string
  ano: number
  tipo_combustivel: string
  secretaria: number
}

export interface Usuario {
  id?: number
  username: string
  first_name?: string
  last_name?: string
  cpf: string
  password?: string
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
  usuario: number
  veiculo?: number | null
}
