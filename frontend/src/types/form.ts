export type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | "checkbox"

export interface FieldOption {
  label: string
  value: string | number
}

export interface FormField {
  name: string              // Nome do campo;
  label: string             // Rótulo na tabela de listagem;
  type: FieldType           // Tipo de dado (number, string, select, etc.);
  endpoint?: string         // Endpoint de onde os dados desse campo são buscados (usado em selects para FK);
  required?: boolean        // Se o campo é obrigatório ou não de ser preenchido;
  options?: FieldOption[]   // Se for tipo 'select' ele usa isso para a lista de opções;
  // Quando a api retornar isso como chave estrangeira em outra tabela, 
  // 'optionLabel' é a label do campo e 'optionValue' é o seu valor.
  // Por exemplo: identificar a instituição de id=2 pelo nome. Então:
  // optionLabel="nome" e optionValue="Escola Fantasia".
  optionLabel?: string
  optionValue?: string
  dependsOn?: string        // Nome do campo que controla o filtro deste select.
  dependsOnParam?: string   // Nome do query param para o filtro. Se omitido, usa dependsOn.
}

export interface FormSchema {
  fields: FormField[]
}
