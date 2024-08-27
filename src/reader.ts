import * as path from 'path'
import { parse } from 'yaml'

import { YamlContent } from './types'
import { FileNotFoundError, InvalidYamlContentError, UnsupportedMimeTypeError } from './errors'
import { Logger, createConsoleLogger } from './logger'
import { SchemaCompiler } from './schemaCompiler'
import { SchemaReader } from './schemaReader'
import { TextFileLoader, toAbsolutePath } from './textFileLoader'
import { MimeType } from './mimeType'

export interface ReadOptions {
  throwIfNotFound?: boolean
  replaceEnvVariables?: boolean
  validate?: boolean
}

const isObject = (item: unknown): boolean => {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

const getBasePath = (basePath: string, filePath: string): string => {
  const absolutePath = toAbsolutePath(basePath, filePath)
  return path.dirname(absolutePath)
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
  private loader: TextFileLoader
  private compiler: SchemaCompiler

  constructor(
    private basePath: string = process.cwd(),
    private logger: Logger = createConsoleLogger('YAML-JS/Reader.Reader', undefined, 'INFO')
  ) {
    this.loader = new TextFileLoader(basePath)
    this.compiler = new SchemaCompiler(this.loader)
  }

  private async validateYaml(content: YamlContent): Promise<void> {
    if (content.$schema) {
      this.logger.debug(() => `Validating content against schema`, { content: content, schema: content.$schema })
      const schemaReader = new SchemaReader(this.loader, this.compiler)
      const schema = await schemaReader.readAndCompile(content.$schema)
      const validationResult = schema.validate(content)
      if (!validationResult.valid) {
        throw new InvalidYamlContentError(content.$schema ?? '', validationResult.errors.join('\n'))
      }
    }
  }

  public async read(files: string[], options?: ReadOptions): Promise<YamlContent> {
    let result: YamlContent = {}
    const validate = options?.validate ?? false
    const throwIfNotFound = options?.throwIfNotFound ?? false
    const replaceEnvVariables = options?.replaceEnvVariables ?? true

    const filesRootPath = getBasePath(this.basePath, files[0])
    for (const file of files) {
      this.loader.basePath = process.cwd()
      const exists = await this.loader.exists(file)
      if (exists) {
        this.logger.debug(() => `Reading file ${file}`)

        const res = await this.loader.load(file)
        let content = res.content
        if (replaceEnvVariables) {
          content = doReplaceEnvVars(content)
        }

        if (res.mimeType === MimeType.YAML) {
          const yamlContent = parseYaml(content) as YamlContent
          result = merge(result, yamlContent)
        } else {
          throw new UnsupportedMimeTypeError(res.mimeType.value)
        }
      } else if (throwIfNotFound) {
        throw new FileNotFoundError(file)
      }
    }

    this.loader.basePath = filesRootPath
    if (validate) await this.validateYaml(result)
    return result
  }
}

const defaultReader = new Reader(process.cwd())

export const readMultiple = async (files: string[], options?: ReadOptions): Promise<YamlContent> => {
  if (files.length === 0) {
    return {}
  }
  return defaultReader.read(files, options)
}

export const read = async (filePath: string, options?: ReadOptions): Promise<YamlContent> => {
  return defaultReader.read([filePath], options)
}

export const parseYaml = (content: string): Record<string, unknown> => {
  return parse(content) as Record<string, unknown>
}
