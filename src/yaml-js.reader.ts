import { parseYaml } from './reader'

export { FileNotFoundError, InvalidSchemaError, type YamlContent, type YamlSchemaDefinition } from './types'
export { Schema } from './schema'
export { read, readMultiple, readSync, readMultipleSync, Reader, type ReadOptions } from './reader'
export { read as readSchema, readSync as readSchemaSync, SchemaReader } from './schemaReader'
export { validate, validateSync, Validator } from './validator'


String.prototype.parseYaml = function(this: string): Record<string, unknown> {
  return parseYaml(this)
};
