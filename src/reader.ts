import * as fs from 'fs'
import { parse as parseYaml } from 'yaml'

import { type BufferEncoding, FileNotFoundError } from './types'
import { Logger, createConsoleLogger } from './logger'

export type YamlContent = Record<string, unknown>

export interface ReadOptions {
  encoding?: BufferEncoding
  throwIfNotFound?: boolean
  replaceEnvVariables?: boolean
}

export interface ReadItem {
  path: string
  options?: ReadOptions
}

const isObject = (item: unknown): boolean => {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

const merge = (target: YamlContent, source: YamlContent): YamlContent => {
  const result = { ...target }
  for (const key in source) {
    const sourceValue = source[key]
    if (isObject(sourceValue) && isObject(target[key])) {
      result[key] = merge(target[key] as YamlContent, sourceValue as YamlContent)
    } else {
      result[key] = sourceValue
    }
  }
  return result
}

// Pattern to match ${VAR_NAME} or ${VAR_NAME:DEFAULT_VALUE}
const pattern = /\$\{(?<VAR>[A-Za-z0-9_]+)(?::(?<DEFAULT>[^}]*))?\}/g

const doReplaceEnvVars = (content: string): string => {
  const result = content.replaceAll(pattern, (_, varName, defaultValue) => {
    return process.env[varName] ?? defaultValue ?? `\${${varName}}`
  })
  return result
}

export class Reader {
  private logger: Logger

  constructor(logger?: Logger) {
    this.logger = logger ?? createConsoleLogger('YAML-JS/Reader.Schema', undefined, 'INFO')
  }

  public async read(items: ReadItem[]): Promise<YamlContent> {
    let result: YamlContent = {}
    for (const item of items) {
      const encoding = item.options?.encoding || 'utf-8'
      const throwIfNotFound = item.options?.throwIfNotFound || false
      const replaceEnvVariables = item.options?.replaceEnvVariables ?? true

      const exists = await fs.promises
        .access(item.path, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false)

      if (exists) {
        this.logger.debug(() => `Reading file ${item.path}`)
        const content = await fs.promises.readFile(item.path, encoding)
        const yamlContent = parseYaml(replaceEnvVariables ? doReplaceEnvVars(content) : content) as YamlContent
        result = merge(result, yamlContent)
      } else if (throwIfNotFound) {
        throw new FileNotFoundError(item.path)
      }
    }
    return result
  }

  public readSync(items: ReadItem[]): YamlContent {
    let result: YamlContent = {}
    for (const item of items) {
      const encoding = item.options?.encoding || 'utf-8'
      const throwIfNotFound = item.options?.throwIfNotFound || false
      const replaceEnvVariables = item.options?.replaceEnvVariables ?? true

      const exists = fs.existsSync(item.path)
      if (exists) {
        this.logger.debug(() => `Reading file ${item.path}`)
        const content = fs.readFileSync(item.path, encoding)
        const yamlContent = parseYaml(replaceEnvVariables ? doReplaceEnvVars(content) : content) as YamlContent
        result = merge(result, yamlContent)
      } else if (throwIfNotFound) {
        throw new FileNotFoundError(item.path)
      }
    }
    return result
  }
}

const defaultReader = new Reader()

export const readMultipleSync = (items: ReadItem[]): YamlContent => {
  return defaultReader.readSync(items)
}

export const readSync = (path: string, options?: ReadOptions): YamlContent => {
  return defaultReader.readSync([{ path, options }])
}

export const readMultiple = async (items: ReadItem[]): Promise<YamlContent> => {
  return defaultReader.read(items)
}

export const read = async (path: string, options?: ReadOptions): Promise<YamlContent> => {
  return defaultReader.read([{ path, options }])
}
