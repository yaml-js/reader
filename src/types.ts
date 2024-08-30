export type YamlContent = {
  $id?: string
  $schema?: string
  [x: string]: unknown
}

interface YamlSchemaItem {
  $id?: string
  $schema?: string
  $ref?: string
  $comment?: string
  title?: string
  description?: string
  default?: unknown
  examples?: unknown[]
}

interface YamlSchemaPrimitiveItem extends YamlSchemaItem {
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

interface YamlSchemaArrayItem extends YamlSchemaItem {
  type: 'array'
  items?: YamlSchemaItem | YamlSchemaItem[]
  additionalItems?: YamlSchemaItem | boolean
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  contains?: YamlSchemaItem
}

interface YamlSchemaObjectItem extends YamlSchemaItem {
  type: 'object'
  properties?: { [key: string]: YamlSchemaItem }
  patternProperties?: { [key: string]: YamlSchemaItem }
  additionalProperties?: YamlSchemaItem | boolean
  maxProperties?: number
  minProperties?: number
  required?: string[]
  dependencies?: { [key: string]: YamlSchemaItem | string[] }
  propertyNames?: YamlSchemaItem
}

export type YamlSchemaDefinition = YamlSchemaPrimitiveItem | YamlSchemaArrayItem | YamlSchemaObjectItem

export interface ValidationResults {
  valid: boolean
  errors: string[]
}
