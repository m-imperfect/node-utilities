import { existsSync, mkdirSync, writeFileSync, appendFileSync } from 'fs'
import { dirname } from 'path'
import { format } from 'util'

type StringMap<value> = { [key: string]: value }
type Method<outcome> = (...any: any[]) => outcome
type Formatter = Method<string>
type Writer = Method<any>

export let writers: StringMap<Writer> = {
  default: function createDefaultWriter() {
    return function defaultWriter(message: string) {
      process.stdout.write(message + '\n')
    }
  }
}

writers.file = function createFileWriter(path: string, createDir = false, errorsHandler?: Function, options = { encoding: 'utf-8' }) {
  return function fileWriter(message: string) {
    try {
      let directory = dirname(path)
      if (!existsSync(directory) && createDir) mkdirSync(directory)
      let write: Function = writeFileSync
      if (existsSync(path)) write = appendFileSync
      write(path, message + '\n', options)
    } catch (error) {
      errorsHandler?.(error)
    }
  }
}

export let formatters: StringMap<Formatter> = { default: format }

formatters.label = function labelFormatter(label: string, ...param: any[]) {
  return `[${label}] ${format(...param)}`
}

formatters.time = function timeFormatter(...param: any[]) {
  return `[${new Date().toISOString()}] ${format(...param)}`
}

formatters.labeledTime = function labeledTimeFormatter(label: string, ...param: any[]) {
  return `[${new Date().toISOString()}][${label}] ${format(...param)}`
}

export let create = function createLogger(writer?: Writer, formatter?: Formatter) {
  let _writer = writer ? writer : writers.default
  let _formatter = formatter ? formatter : formatters.default
  return function logger(...args: any[]) {
    return _writer(_formatter(...args))
  }
}