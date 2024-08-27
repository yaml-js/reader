export type YamlContent = {
  $id?: string
  $schema?: string
  [x: string]: unknown
}

export interface YamlSchemaDefinition {
  $id?: string
  $schema?: string
  title?: string
  [x: string]: unknown
}

export interface ValidationResults {
  valid: boolean
  errors: string[]
}
