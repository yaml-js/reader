import { Logger, createConsoleLogger } from './logger'
import { ValidationResults } from './types'
import { ReadOptions, read } from './reader'
import { readAndCompile } from './schemaReader'

export class Validator {
  private logger: Logger

  constructor(logger?: Logger) {
    this.logger = logger ?? createConsoleLogger('YAML-JS/Reader.Validator', undefined, 'INFO')
  }

  public async validate(schema: string, file: string, options?: ReadOptions): Promise<ValidationResults> {
    const yaml = await read(file, options)
    const yamlSchema = await readAndCompile(schema)

    this.logger.debug(() => 'Validating content against schema', { content: yaml, schema: yamlSchema.definition })
    return yamlSchema.validate(yaml)
  }
}

const defaultValdiator = new Validator()

export const validate = async (schema: string, file: string, options?: ReadOptions): Promise<ValidationResults> => {
  return defaultValdiator.validate(schema, file, options)
}
