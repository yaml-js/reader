export type YamlContent = {
  $id?: string
  $schema?: string
  [x: string]: unknown
}

interface YamlSchemaItemDefinition {
  $id?: string
  $schema?: string
  $ref?: string
  $comment?: string
  title?: string
  description?: string
  default?: unknown
  examples?: unknown[]
}

export interface YamlSchemaPrimitiveItemDefinition extends YamlSchemaItemDefinition {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'null'
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

export interface YamlSchemaArrayItemDefinition extends YamlSchemaItemDefinition {
  type: 'array'
  items?: YamlSchemaItemDefinition | YamlSchemaItemDefinition[]
  additionalItems?: YamlSchemaItemDefinition | boolean
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  contains?: YamlSchemaItemDefinition
}

export interface YamlSchemaObjectItemDefinition extends YamlSchemaItemDefinition {
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

export type YamlSchemaDefinition = YamlSchemaPrimitiveItemDefinition | YamlSchemaArrayItemDefinition | YamlSchemaObjectItemDefinition

export interface ValidationResults {
  valid: boolean
  errors: string[]
}
