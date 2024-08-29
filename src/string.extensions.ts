import { parseYaml } from './reader'

declare global {
  interface String {
    parseYaml(): Record<string, unknown>
  }
}

String.prototype.parseYaml = function (this: string): Record<string, unknown> {
  return parseYaml(this)
}
