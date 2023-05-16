export let { isInteger } = Number

/**
 * Checking whether the value is a real number (number but not NaN)
 */
export function isRealNumber(value: any): value is number {
  return ((typeof value == 'number') && !Number.isNaN(value))
}

/**
 * Checking whether the value is a number with decimal places (real number but not integer)
 */
export function isDecimal(value: any): value is number {
  return (isRealNumber(value) && !isInteger(value))
}
