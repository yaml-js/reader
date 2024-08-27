import * as fs from 'fs'

import { Logger, createConsoleLogger } from './logger'
import { BufferEncoding, FileNotFoundError, InvalidSchemaError, YamlSchemaDefinition } from './types'
import { Schema } from './schema'
import { SchemaRegistry } from './schemaRegistry'

export class SchemaReader {
  constructor(
    private schemaRegistry: SchemaRegistry = new SchemaRegistry(),
    private logger: Logger = createConsoleLogger('YAML-JS/Reader.SchemaReader', undefined, 'INFO')
  ) {}

  private parseSchema(source: string, content: string): YamlSchemaDefinition {
    const lastDotIndex = source.lastIndexOf('.')
    let isJson = true
    if (lastDotIndex > 0) {
      isJson = source.slice(source.lastIndexOf('.') + 2).toLowerCase() === 'json'
    }
    const parsedSchema = isJson ? JSON.parse(content) : content.parseYaml();
    const result = this.schemaRegistry.validate(parsedSchema)
    if (!result.valid) {
      this.logger.error(() => `Invalid schema: ${source}`, result.errors)
      throw new InvalidSchemaError(result.errors.join('\n'))
    }

    return parsedSchema
  }

  public async read(path: string, encoding?: BufferEncoding): Promise<YamlSchemaDefinition> {
    if (!encoding) encoding = 'utf-8'

    const exists = await fs.promises
      .access(path, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false)

    if (exists) {
      this.logger.debug(() => `Reading schema from file ${path}`)
      const content = await fs.promises.readFile(path, encoding)
      return this.parseSchema(path, content)
    } else {
      this.logger.error(() => `File not found: ${path}`)
      throw new FileNotFoundError(path)
    }
  }

  public async readAndCompile(path: string, encoding?: BufferEncoding): Promise<Schema> {
    const schema = await this.read(path, encoding)
    const validationFunction = await this.schemaRegistry.compile(schema)
    return Schema.create(schema, validationFunction)
  }

  public readSync(path: string, encoding?: BufferEncoding): YamlSchemaDefinition {
    if (!encoding) encoding = 'utf-8'

    const exists = fs.existsSync(path)
    if (exists) {
      this.logger.debug(() => `Reading schema from file ${path}`)
      const content = fs.readFileSync(path, encoding)
      return this.parseSchema(path, content)
    } else {
      this.logger.error(() => `File not found: ${path}`)
      throw new FileNotFoundError(path)
    }
  }

  public readAndCompileSync(path: string, encoding?: BufferEncoding): Schema {
    const schema = this.readSync(path, encoding)
    const validationFunction = this.schemaRegistry.compileSync(schema)
    return Schema.create(schema, validationFunction)
  }
}

const defaultReader = new SchemaReader()

export const readSync = (path: string, encoding?: BufferEncoding): YamlSchemaDefinition => {
  return defaultReader.readSync(path, encoding)
}

export const read = (path: string, encoding?: BufferEncoding): Promise<YamlSchemaDefinition> => {
  return defaultReader.read(path, encoding)
}

export const readAndCompileSync = (path: string, encoding?: BufferEncoding): Schema => {
  return defaultReader.readAndCompileSync(path, encoding)
}

export const readAndCompile = (path: string, encoding?: BufferEncoding): Promise<Schema> => {
  return defaultReader.readAndCompile(path, encoding)
}
