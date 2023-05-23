/**
 * Reversing a string (first letter be the last, the last be the first, etc...)
 */
export function reverse(value: string): string { return value.split('').reverse().join('') }

/**
 * Getting a piece of a string or replace it
 */
export function between(value: string, start: number, end: number, replace?: string) {
  if (replace) {
    return value.slice(0, start) + replace + value.slice(end, value.length)
  } else {
    return value.slice(start, end)
  }
};
