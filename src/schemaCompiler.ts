import Ajv, { ValidateFunction as AjvValidationFunction, ErrorObject } from 'ajv'
import { ValidationResults, YamlContent, YamlSchemaDefinition } from './types'
import { TextFileLoader } from './textFileLoader'
import { MimeType } from './mimeType'
import { UnsupportedMimeTypeError } from './errors'

export type ValidateFunction = (content: YamlContent) => ValidationResults

const mapErrors = (errors?: ErrorObject[] | null): string[] => {
  return errors ? (errors.map((e) => e.message).filter((item) => !!item) as string[]) : []
}

export class SchemaCompiler {
  private ajv = new Ajv({ loadSchema: this.loadSchema })
  private compiledSchemaCache: Map<string, ValidateFunction> = new Map()

  public constructor(private loader: TextFileLoader) {}

  public validate(schema: YamlSchemaDefinition): ValidationResults {
    const valid = this.ajv.validateSchema(schema) as boolean
    const errors = mapErrors(this.ajv.errors)
    return { valid, errors }
  }

  private async loadSchema(uri: string): Promise<YamlSchemaDefinition> {
    const file = await this.loader.load(uri)
    if (file.mimeType == MimeType.JSON) {
      return JSON.parse(file.content)
    } else if (file.mimeType == MimeType.YAML) {
      return file.content.parseYaml()
    } else {
      throw new UnsupportedMimeTypeError(file.mimeType.value)
    }
  }

  private createValidateFunction(func: AjvValidationFunction): ValidateFunction {
    return (content: YamlContent) => {
      const valid = func(content)
      const errors = mapErrors(func.errors)
      return { valid, errors }
    }
  }
  public async compile(schema: YamlSchemaDefinition): Promise<ValidateFunction> {
    if (schema.$id && this.compiledSchemaCache.has(schema.$id)) {
      return this.compiledSchemaCache.get(schema.$id) as ValidateFunction
    }

    const result = this.createValidateFunction(await this.ajv.compileAsync(schema))
    if (schema.$id) this.compiledSchemaCache.set(schema.$id, result)
    return result
  }
}
