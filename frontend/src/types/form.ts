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
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: FieldOption[]
}

export interface FormSchema {
  fields: FormField[]
}