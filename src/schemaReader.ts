import * as fs from 'fs'
import { parse as parseYaml } from 'yaml'

import { Logger, createConsoleLogger } from './logger'
import { type BufferEncoding, FileNotFoundError } from './types'

export interface YamlSchema {
  $id?: string
  $schema?: string
  title?: string
  [x: string]: unknown
}

const parseSchema = (source: string, content: string): YamlSchema => {
  const lastDotIndex = source.lastIndexOf('.')
  let isJson = true
  if (lastDotIndex > 0) {
    isJson = source.slice(source.lastIndexOf('.') + 2).toLowerCase() === 'json'
  }
  return isJson ? JSON.parse(content) : parseYaml(content)
}

export class SchemaReader {
  private logger: Logger

  constructor(logger?: Logger) {
    this.logger = logger ?? createConsoleLogger('YAML-JS/Reader.Reader', undefined, 'INFO')
  }

  public async read(path: string, encoding?: BufferEncoding): Promise<YamlSchema> {
    if (!encoding) encoding = 'utf-8'

    const exists = await fs.promises
      .access(path, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false)

    if (exists) {
      this.logger.debug(() => `Reading schema from file ${path}`)
      const content = await fs.promises.readFile(path, encoding)
      return parseSchema(path, content)
    } else {
      throw new FileNotFoundError(path)
    }
  }

  public readSync(path: string, encoding?: BufferEncoding): YamlSchema {
    if (!encoding) encoding = 'utf-8'

    const exists = fs.existsSync(path)
    if (exists) {
      this.logger.debug(() => `Reading schema from file ${path}`)
      const content = fs.readFileSync(path, encoding)
      return parseSchema(path, content)
    } else {
      throw new FileNotFoundError(path)
    }
  }
}

const defaultReader = new SchemaReader()

export const readSync = (path: string, encoding?: BufferEncoding): YamlSchema => {
  return defaultReader.readSync(path, encoding)
}

export const read = async (path: string, encoding?: BufferEncoding): Promise<YamlSchema> => {
  return defaultReader.read(path, encoding)
}
