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
