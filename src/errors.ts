import { format } from 'util'
import { join } from 'path'
import { string } from './random'
import { FileWriter } from './log'

/**
 * Saving an error in the errors' directory with a key
 * @param err Any kind of errors, TypeError, SyntaxError, etc...
 * @param key The key which error will be saved with, %s to will be replaced with a random string with 8 ASCII charset
 * @param title The title that will be in the head of the message in the file
 * @param dir a directory path to save the error file in
 * @returns The error code
 */
export function save(error: any, key?: string, title?: string, dir?: string): string | undefined {
  try {
    let errorCode = string(8)
    let fileName = (key)?format(key, errorCode):errorCode
    let filePath = join(dir ?? (process.env['ERRORS_DIRECTORY'] ?? 'errors'), `${fileName}.log`)
    let writer = new FileWriter(filePath, true)
    let dateString = `[${new Date().toISOString()}]`
    if (title) dateString += ' ' + title
    let message = `${dateString}\n${format(error)}\n`
    let stack = (new Error('TraceGetter').stack?.split('\n')??[]).slice(2)
    if (stack.length > 0) {
      message += "\nstack trace:\n"
      for (let line of stack) message += line + '\n'
    }
    writer.write(message + '\n')
    console.log(`\x1b[1m[Errors Log] \x1b[33mSaved an error in ${fileName}\x1b[0m`)
    return errorCode
  } catch (error) {
    console.error(error)
    console.error(...(key?[key, error]:[error]))
  }
}

export class CodedError extends Error {
  code: string
  constructor(code: string, message?: string | undefined) {
    super(message)
    this.code = code
  }
}
