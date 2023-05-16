export type CommonTypes = 'undefined' | 'object' | 'function' | 'string' | 'symbol' | 'boolean' | 'number' | 'bigint'

/**
 * Checking whether the value is a string and has one character at least
 */
export function isText(value: any): value is string {
  return (typeof value == 'string') && value.length > 0
}

export let { isArray } = Array

export type Dictionary = { [ key: string | number | symbol ]: any }
/**
 * Checking whether the value is an object with keys and values (not an array)
 */
export function isDictionary(value: any): value is Dictionary {
  return value !== null && (typeof value == 'object') && !Array.isArray(value)
}

/**
 * Getting all unique values in an array
 */
export function uniqueArray(array: any[]): any[] {
  if (Array.isArray(array)) {
    return array.filter((value, index, array) => array.indexOf(value) === index)
  } else {
    return array
  }
}
