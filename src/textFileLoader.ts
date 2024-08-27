import * as fs from 'fs/promises'
import * as path from 'path'
import * as url from 'url'
import { MimeType } from './mimeType'

const isRemote = (uri: string): boolean => {
  return uri.startsWith('http://') || uri.startsWith('https://')
}

export const toAbsolutePath = (basePath: string, uri: string): string => {
  if (uri.startsWith('/')) {
    return uri
  } else if (uri.startsWith('file://')) {
    return url.fileURLToPath(uri)
  } else {
    return path.resolve(basePath, uri)
  }
}

export interface TextFile {
  uri: string
  content: string
  mimeType: MimeType
}

export class TextFileLoader {
  public constructor(public basePath: string = process.cwd()) {}

  public async load(uri: string): Promise<TextFile> {
    if (isRemote(uri)) {
      const req = await fetch(uri, { method: 'GET' })
      const mimeType = MimeType.fromString(req.headers.get('content-type') ?? 'application/json')
      const content = await req.text()
      return { uri, content, mimeType }
    } else {
      const path = toAbsolutePath(this.basePath, uri)
      const content = await fs.readFile(path, 'utf-8')
      const lastDotIndex = uri.lastIndexOf('.')
      const extension = uri.slice(lastDotIndex).toLowerCase()
      const mimeType = MimeType.fromFileExtension(extension)
      return { uri, content, mimeType }
    }
  }

  public async exists(uri: string): Promise<boolean> {
    if (isRemote(uri)) {
      const req = await fetch(uri, { method: 'HEAD' })
      return req.status === 200
    } else {
      const absolutePath = toAbsolutePath(this.basePath, uri)
      return fs
        .access(absolutePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false)
    }
  }
}
