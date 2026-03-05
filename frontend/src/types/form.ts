export type FieldType =
  | "text"
  | "number"
  | "select"
  | "date"

export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: { label: string; value: string | number }[]
}

export interface FormSchema {
  fields: FormField[]
}