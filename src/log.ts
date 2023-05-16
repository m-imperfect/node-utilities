import {
  existsSync, mkdirSync,
  writeFileSync, appendFileSync,
  WriteFileOptions
} from 'fs'
import { dirname } from 'path'
import { format } from 'util'

type Writer = (...any: any[]) => any
export function defaultWriter(message: string) { process.stdout.write(message + '\n') }

export class WriterClass {
  write: Writer
  constructor(writer: Writer) {
    this.write = writer
  }
}

export class FileWriter extends WriterClass {
  path: string
  mkdir: boolean
  options: WriteFileOptions
  onError?: Function

  constructor(path: string, mkdir = false, options?: WriteFileOptions, onError?: Function) {
    super((message: string) => {
      try {
        let dir = dirname(this.path)
        if (!existsSync(dir) && this.mkdir) mkdirSync(dir, { recursive: true })
        let write: Function = writeFileSync
        if (existsSync(this.path)) write = appendFileSync
        write(this.path, message + '\n', this.options)
      } catch (error) {
        if (!this.onError) throw error
        this.onError(message, error)
      }
    })
    
    this.path = path
    this.mkdir = mkdir
    if (!options) options = { encoding: 'utf-8' }
    this.options = options
    this.onError = onError
  }
}

type Formatter = (...any: any[]) => string;
type BuiltInFormatter = 'default' | 'label' | 'time' | 'labeledTime'
export let formatters: Record<BuiltInFormatter, Formatter> = {
  default: format,

  label: function labelFormatter(label: string, ...param: any[]) {
    return `[${label}] ${format(...param)}`
  },

  time: function timeFormatter(...param: any[]) {
    return `[${new Date().toISOString()}] ${format(...param)}`
  },

  labeledTime: function labeledTimeFormatter(label: string, ...param: any[]) {
    return `[${new Date().toISOString()}][${label}] ${format(...param)}`
  },
}

export let create = function createLogger(writer?: Writer | WriterClass, formatter?: Formatter) {
  let _formatter = formatter ? formatter : formatters.default
  if (writer instanceof WriterClass) {
    return function logger(...args: any[]) {
      return writer.write(_formatter(...args))
    }  
  } else {
    let _writer = writer ? writer : defaultWriter
    return function logger(...args: any[]) {
      return _writer(_formatter(...args))
    }
  }
}