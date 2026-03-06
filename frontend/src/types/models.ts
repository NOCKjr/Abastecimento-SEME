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
  rota: number
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
