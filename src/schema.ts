import { Logger, getLogger } from '@yaml-js/core.logging'
import { ValidateFunction } from './schemaCompiler'
import { ValidationResults, YamlContent, YamlSchemaDefinition } from './types'

export class Schema {
  private constructor(
    private schema: YamlSchemaDefinition,
    private validateFunction: ValidateFunction,
    private logger: Logger = getLogger('org.ymal-js.reader.Schema')
  ) {}

  public static create(schema: YamlSchemaDefinition, validateFunction: ValidateFunction, logger?: Logger): Schema {
    return new Schema(schema, validateFunction, logger)
  }

  public get definition(): YamlSchemaDefinition {
    return this.schema
  }

  public validate<T extends YamlContent>(content: T): ValidationResults {
    this.logger.debug(() => 'Validating content against schema', { content, schema: this.definition })
    return this.validateFunction(content)
  }
}
