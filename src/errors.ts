export class FileNotFoundError extends Error {
  constructor(path: string) {
    super(`File not found: ${path}`)
  }
}

export class InvalidSchemaError extends Error {
  constructor(error: string) {
    super(`Invalid Schema: ${error}`)
  }
}

export class InvalidYamlContentError extends Error {
  constructor(schema: string, error: string) {
    super(`Yaml content not valid for schema '${schema}': ${error}`)
  }
}

export class UnsupportedMimeTypeError extends Error {
  constructor(contentType: string) {
    super(`Unsupported mime type: ${contentType}`)
  }
}
