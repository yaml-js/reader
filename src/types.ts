export type YamlContent = {
  $id?: string
  $schema?: string
  [x: string]: unknown
}

interface YamlSchemaItemBaseDefinition {
  $id?: string
  $schema?: string
  $ref?: string
  $comment?: string
  title?: string
  description?: string
  default?: unknown
  examples?: unknown[]
}

export interface YamlSchemaPrimitiveItemDefinition extends YamlSchemaItemBaseDefinition {
  type: 'string' | 'number' | 'integer' | 'boolean'
  format?: string
  contentMediaType?: string
  contentEncoding?: string
  const?: unknown
  enum?: unknown[]
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string
}

export interface YamlSchemaArrayItemDefinition extends YamlSchemaItemBaseDefinition {
  type: 'array'
  items?: YamlSchemaItemDefinition | YamlSchemaItemDefinition[]
  additionalItems?: YamlSchemaItemDefinition | boolean
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  contains?: YamlSchemaItemDefinition
}

export interface YamlSchemaObjectItemDefinition extends YamlSchemaItemBaseDefinition {
  type: 'object'
  properties?: { [key: string]: YamlSchemaItemDefinition }
  patternProperties?: { [key: string]: YamlSchemaItemDefinition }
  additionalProperties?: YamlSchemaItemDefinition | boolean
  maxProperties?: number
  minProperties?: number
  required?: string[]
  dependencies?: { [key: string]: YamlSchemaItemDefinition | string[] }
  propertyNames?: YamlSchemaItemDefinition
}

export type YamlSchemaItemDefinition = YamlSchemaPrimitiveItemDefinition | YamlSchemaArrayItemDefinition | YamlSchemaObjectItemDefinition
export type YamlSchemaDefinition = YamlSchemaPrimitiveItemDefinition | YamlSchemaArrayItemDefinition | YamlSchemaObjectItemDefinition

export interface ValidationResults {
  valid: boolean
  errors: string[]
}
