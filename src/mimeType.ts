export class MimeType {
  static readonly JSON = new MimeType('application/json')
  static readonly YAML = new MimeType('application/yaml')

  private constructor(public readonly value: string) {}

  public static fromString(value: string): MimeType {
    const lowerCaseValue = value.toLowerCase()
    if (lowerCaseValue.startsWith(MimeType.JSON.value)) {
      return MimeType.JSON
    } else if (lowerCaseValue.startsWith(MimeType.YAML.value)) {
      return MimeType.YAML
    } else {
      throw new Error(`Unsupported content type: ${value}`)
    }
  }

  public static fromFileExtension(extension: string): MimeType {
    const lowerCaseExtension = extension.toLowerCase()
    switch (lowerCaseExtension) {
      case 'json':
      case '.json':
        return MimeType.JSON
      case 'yaml':
      case '.yaml':
      case 'yml':
      case '.yml':
        return MimeType.YAML
      default:
        throw new Error(`Unsupported file extension: ${extension}`)
    }
  }
}
