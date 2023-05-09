let isType = (value: any, type: any): boolean => typeof value == type
let isText = (value: any): boolean => isType(value, 'string') && value.length > 0
let isDictionary = (value: any): boolean => isType(value, 'object') && value != null && !Array.isArray(value)
let toString = (value: any, _default: any): string => { try { return `${value}` } catch { return _default } }

class ValidationError extends Error {
  trace: string[]
  code: string
  comparison?: string
  constructor(trace: string[], options: { code?: string, comparison?: string }) {
    let { code, comparison } = options
    switch(code) {
      case 'UNASSIGNED_KEY':
        super("There is a key in an object that is not declared in the validator.")
      break
      case 'UNEQUAL':
        super("The value is not the validator.")
      break
      default: super("Invalid type.")
    }
    this.trace = trace
    this.code = code ?? 'INVALID_TYPE'
    if (comparison) this.comparison = comparison
  }
}

let validators: { [key: string]: any } = {}
export let defineValidator = (key: string, validator: any) => validators[key] = validator

export function validate(value: any, validator: any, trace:string[] = ['origin'], validated: any[] = []) {
  if (validated.includes(value)) return
  if (Array.isArray(validator)) {
    validator.forEach((subvalidator, index) => validate(value[index], subvalidator, [...trace, `at[${index}]`], validated))
  } else if (isDictionary(validator)) {
    if (!isDictionary(value)) throw new ValidationError(trace, { comparison: 'dictionary' })
    let validatorKeys = Object.keys(validator)
    let valueKeys = Object.keys(value)
    valueKeys.forEach(key => { if (!validatorKeys.includes(key)) throw new ValidationError([...trace, toString(key, '[Anonymous Key]')], { code: 'UNASSIGNED_KEY' }) })
    validated.push(value)
    valueKeys.forEach(key => validate(value[key], validator[key], [...trace, toString(key, '[Anonymous Key]')], validated))
  } else if (isText(validator)) {
    switch(validator) {
      case 'any': return
      case 'text':
        if (!isText(value)) return
        break
      case 'realNumber':
        if (!(isType(value, 'number') && !Number.isNaN(value))) return
        break
      default: 
        let type: string = validator

        if (type in validators) {
          validate(value, validators[type], trace, validated)
          return
        }

        if (type.endsWith('[]')) {
          let subtype = type.substring(0, type.length-2)
          validated.push(value)
          if (!Array.isArray(value)) throw new ValidationError(trace, { comparison: 'array' })
          value.forEach((subvalue, index) => validate(subvalue, subtype, [...trace, `at[${index}]`], validated))
          return
        }
        
        let subtypes = type.split('|').map(subtype => subtype.trim())
        if (subtypes.length > 1) {
          let last_index = subtypes.length
          for(let index = 0; index <= last_index; index++) {
            try {
              validate(value, subtypes[index], trace, validated)
              return
            } catch {}
          }
        }

        if (type.startsWith('{') && type.endsWith('}')) {
          let sides = type.substring(1, type.length-1).split(':').map(side => side.trim())
          let [keysType, valuesType] = sides
          if (sides.length == 2 && sides.every(side => side.length > 0)) {
            if (!isDictionary(value)) throw new ValidationError(trace, { comparison: 'dictionary' })
            validated.push(value)
            Object.keys(value).forEach(key => {
              let stringKey = toString(key, '[Anonymous Key]')
              validate(key, keysType, [...trace, stringKey], validated)
              validate(value[key], valuesType, [...trace, stringKey + ':value'], validated)
            })
            return
          }
        }

        if (isType(value, validator)) return
    }
    
    throw new ValidationError(trace, { comparison: toString(validator, undefined) })
  } else {
    if (value !== validator) throw new ValidationError(trace, { code: 'UNEQUAL', comparison: toString(validator, undefined) })
  }
}

export function isValid(value: any, validator: any) {
  try {
    validate(value, validator)
    return true
  } catch {
    return false
  }
}
