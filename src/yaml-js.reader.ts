import { parseYaml } from './reader'

export { type YamlContent, type YamlSchemaDefinition } from './types'
export { FileNotFoundError, InvalidSchemaError, InvalidYamlContentError, UnsupportedMimeTypeError } from './errors'
export { Schema } from './schema'
export { read, readMultiple, Reader, type ReadOptions } from './reader'
export { read as readSchema, SchemaReader } from './schemaReader'
export { validate, Validator } from './validator'
export { SchemaCompiler } from './schemaCompiler'

export interface String {
  parseYaml(): Record<string, unknown>
}

String.prototype.parseYaml = function (this: string): Record<string, unknown> {
  return parseYaml(this)
}
