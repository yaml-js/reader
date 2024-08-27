import Ajv, { ValidateFunction as AjvValidationFunction } from "ajv";
import { ValidationResults, YamlContent, YamlSchemaDefinition } from "./types";
import { mapErrors } from "./utils";

export type ValidateFunction = (content: YamlContent) => ValidationResults

export class SchemaRegistry {
  private ajv = new Ajv({loadSchema: this.loadSchema})
  private compiledSchemaCache: Map<string, ValidateFunction> = new Map()

  public validate(schema: YamlSchemaDefinition): ValidationResults {
    const valid = this.ajv.validateSchema(schema) as boolean
    const errors = mapErrors(this.ajv.errors)
    return { valid, errors }
  }

  private async loadSchema(uri: string): Promise<YamlSchemaDefinition> {
    const response = await fetch(uri, { method: "GET"})
    if (response.status >= 400) throw new Error(`HTTP ${response.statusText} on fetching schema from ${uri}`)
    return await response.json()
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

  public compileSync(schema: YamlSchemaDefinition): ValidateFunction {
    if (schema.$id && this.compiledSchemaCache.has(schema.$id)) {
      return this.compiledSchemaCache.get(schema.$id) as ValidateFunction
    }

    const result = this.createValidateFunction(this.ajv.compile(schema))
    if (schema.$id) this.compiledSchemaCache.set(schema.$id, result)
    return result
  }
}
