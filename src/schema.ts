import { Logger, createConsoleLogger } from './logger'
import { ValidateFunction } from './schemaRegistry'
import { ValidationResults, YamlContent, YamlSchemaDefinition } from './types'

export class Schema {
  private constructor(
    private schema: YamlSchemaDefinition,
    private validateFunction: ValidateFunction,
    private logger: Logger = createConsoleLogger('YAML-JS/Reader.Schema', undefined, 'INFO')
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
