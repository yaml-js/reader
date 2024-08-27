import { Logger, createConsoleLogger } from './logger'
import { YamlSchemaDefinition } from './types'
import { InvalidSchemaError, FileNotFoundError } from './errors'
import { Schema } from './schema'
import { SchemaCompiler } from './schemaCompiler'
import { TextFileLoader } from './textFileLoader'
import { MimeType } from './mimeType'
import { UnsupportedMimeTypeError } from './errors'

export class SchemaReader {
  constructor(
    private loader: TextFileLoader,
    private compiler: SchemaCompiler,
    private logger: Logger = createConsoleLogger('YAML-JS/Reader.SchemaReader', undefined, 'INFO')
  ) {}

  private parseSchema(source: string, content: string, mimeType: MimeType): YamlSchemaDefinition {
    let parsedSchema: YamlSchemaDefinition
    if (mimeType == MimeType.JSON) {
      parsedSchema = JSON.parse(content)
    } else if (mimeType == MimeType.YAML) {
      parsedSchema = content.parseYaml()
    } else {
      throw new UnsupportedMimeTypeError(mimeType.value)
    }

    const result = this.compiler.validate(parsedSchema)
    if (!result.valid) {
      this.logger.error(() => `Invalid schema: ${source}`, result.errors)
      throw new InvalidSchemaError(result.errors.join('\n'))
    }

    return parsedSchema
  }

  public async read(uri: string, encoding?: BufferEncoding): Promise<YamlSchemaDefinition> {
    if (!encoding) encoding = 'utf-8'

    const exists = await this.loader.exists(uri)

    if (exists) {
      this.logger.debug(() => `Reading schema from ${uri}`)
      const res = await this.loader.load(uri);
      return this.parseSchema(uri, res.content, res.mimeType)
    } else {
      this.logger.error(() => `File not found: ${uri}`)
      throw new FileNotFoundError(uri)
    }
  }

  public async readAndCompile(path: string, encoding?: BufferEncoding): Promise<Schema> {
    const schema = await this.read(path, encoding)
    const validationFunction = await this.compiler.compile(schema)
    return Schema.create(schema, validationFunction)
  }
}

const loader = new TextFileLoader(process.cwd())
const defaultReader = new SchemaReader(loader, new SchemaCompiler(loader))

export const read = (path: string, encoding?: BufferEncoding): Promise<YamlSchemaDefinition> => {
  return defaultReader.read(path, encoding)
}

export const readAndCompile = (path: string, encoding?: BufferEncoding): Promise<Schema> => {
  return defaultReader.readAndCompile(path, encoding)
}
