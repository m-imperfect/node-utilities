import { isArray, isRealNumber, isText } from './validation'

export let { random: decimals } = Math

/**
 * Returns a pseudorandom true or false
*/
export function boolean(): boolean { return decimals() > 0.5 }

/**
 * Randomizing a number in a range [minimum, maximum]
 * @returns NaN if not a real range
*/
export function integer(min: number, max: number): number {
  if (!(isRealNumber(min) && isRealNumber(max))) return NaN
  min = Math.floor(min); max = Math.floor(max)
  if (min == max) return min // return max
  if (max < min) return boolean() ? max : min
  return Math.floor(decimals() * (max - min + 1) + min)
}

let naturalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split('')
/**
 * Randomizing a string using an array of characters
 * @param length Number of characters in the outcome string
 * @param characters Characters array
 * @param unique Deny/Allow repeating characters
 * @returns 
 */
export function string(length?: number, characters: string | string[] = naturalChars, unique = false): string {
  let chars: string[] = []

  if (!isRealNumber(length)) length = integer(1, characters.length)
  length = Math.floor(length)

  if (length <= 0) return ''

  if (isArray(characters) && characters != naturalChars) {
    chars = characters.filter(isText)
  } else if (isText(characters)) {
    chars = characters.split('')
  } else {
    chars = naturalChars
  }
  
  if (unique) {
    chars = chars.filter((value, index, chars) => chars.indexOf(value) === index)
    if (length > chars.length) length = chars.length
    return Array.from({ length }, () =>
      chars.splice(Math.floor(integer(0, chars.length-1)), 1)[0]
    ).join('')
  } else {
    let charsLength = chars.length
    return Array.from({ length }, () => 
      chars[Math.floor(integer(0, charsLength))]
    ).join('')
  }
}
