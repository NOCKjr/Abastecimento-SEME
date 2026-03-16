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
  name: string             // Nome do campo;
  label: string            // Rótulo na tabela de listagem;
  type: FieldType          // Tipo de dado (number, string, select, etc.);
  endpoint?: string        // Endpoint de onde os dados desse campo são buscados (usado em selects para FK);
  required?: boolean       // Se o campo é obrigatório ou não de ser preenchido;
  options?: FieldOption[]  // Se for tipo 'select' ele usa isso para a lista de opções;
  optionLabel?: string
  displayLabel?: string
  optionValue?: string
  hidden?: boolean
  dependsOn?: string        // Nome do campo que controla o filtro deste select.
  dependsOnParam?: string   // Nome do query param para o filtro. Se omitido, usa dependsOn.
  placeholder?: string      // Valor temporário para o campo até o usuário escrever algo
  
  // --- NOVAS PROPRIEDADES ADICIONADAS ---
  disabledUntilParentSelected?: boolean // Bloqueia o campo se o pai (dependsOn) estiver vazio
  autoSelectFirst?: boolean             // Seleciona automaticamente a primeira opção carregada
}

export interface FormSchema {
  fields: FormField[]
}