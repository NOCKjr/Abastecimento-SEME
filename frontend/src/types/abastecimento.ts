export interface Abastecimento {
  id: number;
  veiculo: string;
  litros: number;
  data: string;
  criado_em?: string;
}

export type NovoAbastecimento = Omit<
  Abastecimento,
  "id" | "criado_em"
>;