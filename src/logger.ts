export enum LogLevel {
  DEBUG = 0,
  INFO = 10,
  WARN = 20,
  ERROR = 30
}

type LogWriter = (message: string, args: unknown[]) => void
type MessageProvider = () => string
type MessageFormater = (level: LogLevel, name: string, tag: string | undefined, message: string, args: unknown[]) => string

export interface Logger {
  withTag(tag: string): Logger
  debug(message: MessageProvider, ...args: unknown[]): void
  info(message: MessageProvider, ...args: unknown[]): void
  warn(message: MessageProvider, ...args: unknown[]): void
  error(message: MessageProvider, ...args: unknown[]): void
}

const consoleStyles: { [key: string]: string } = {
  RESET: '\x1b[0m', // Reset to default
  YELLOW: '\x1b[33m', // Yellow color
  RED: '\x1b[31m', // Red color
  BOLD: '\x1b[1m' // Bold text
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colorFullMessageFormater: MessageFormater = (level: LogLevel, name: string, tag: string | undefined, message: string, _args: unknown[]) => {
  let format = consoleStyles.BOLD
  if (level === LogLevel.WARN) {
    format += consoleStyles.YELLOW
  } else if (level === LogLevel.ERROR) {
    format += consoleStyles.RED
  }
  // Construct the tag part
  const tagPart = tag ? `:${tag}` : ''
  const nameAndTagPart = `${format}[${name}${tagPart}]${consoleStyles.RESET}`
  return `${nameAndTagPart} ${message}`
}

export const createConsoleLogger = (name: string, tag?: string, logLevel: string = 'INFO'): Logger => {
  const writer = (message: string, args: unknown[]) => {
    if (args && args.length > 0) {
      console.log(message, args)
    } else {
      console.log(message)
    }
  }

  return createLogger(writer, colorFullMessageFormater, name, tag, logLevel)
}

export const createLogger = (writer: LogWriter, messageFormater: MessageFormater, name: string, tag?: string, logLevel: string = 'INFO'): Logger => {
  const logLevelValue = LogLevel[logLevel as keyof typeof LogLevel] || LogLevel.INFO
  const log = (level: LogLevel, message: MessageProvider, args: unknown[]) => {
    if (level >= logLevelValue) {
      const messageText = message()
      const formatedMessage = messageFormater(level, name, tag, messageText, args)
      writer(formatedMessage, args)
    }
  }

  return {
    withTag: (tag: string) => createLogger(writer, messageFormater, name, tag, logLevel),
    debug: (message: MessageProvider, ...args: unknown[]) => log(LogLevel.DEBUG, message, args),
    info: (message: MessageProvider, ...args: unknown[]) => log(LogLevel.INFO, message, args),
    warn: (message: MessageProvider, ...args: unknown[]) => log(LogLevel.WARN, message, args),
    error: (message: MessageProvider, ...args: unknown[]) => log(LogLevel.ERROR, message, args)
  } as Logger
}
