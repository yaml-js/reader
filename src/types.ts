export type YamlContent = Record<string, unknown>

export interface YamlSchemaDefinition {
  $id?: string
  $schema?: string
  title?: string
  [x: string]: unknown
}

export type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'utf-16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'

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

export interface ValidationResults {
  valid: boolean
  errors: string[]
}
