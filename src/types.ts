export type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'utf-16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'

export class FileNotFoundError extends Error {
  constructor(path: string) {
    super(`File not found: ${path}`)
  }
}
