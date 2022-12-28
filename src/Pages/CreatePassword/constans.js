import { VALIDATION_RULE_MAX } from '@Components/Logic/Validator/constants'

export const VALIDATION_RULE_CUSTOM_REGEX = 'customRegex'

export const WITH_INTEGER = 'includeDigit'
export const WITH_UPPER_CASE = 'includeUpperCase'
export const WITH_LOWER_CASE = 'includeLowerCase'
export const WITH_SPECIAL_CHARS = 'includeSpecial'

export const MIN_LENGTH = 'minLength'
export const MAX_LENGTH = 'maxLength'
export const SPACIAL_CHARS = 'specialChars'

export const backendKeysMap = [
  WITH_INTEGER,
  WITH_UPPER_CASE,
  WITH_LOWER_CASE,
  WITH_SPECIAL_CHARS,
  MIN_LENGTH,
  MAX_LENGTH,
]

export const messagesMap = {
  [WITH_INTEGER]: () => 'Должен содержать арабские цифры (0...9)',
  [WITH_UPPER_CASE]: () => 'Должен содержать прописные латинские буквы (A...Z)',
  [WITH_LOWER_CASE]: () => 'Должен содержать строчные латинские буквы (a...z)',
  [WITH_SPECIAL_CHARS]: ({ specialChars }) =>
    `Должен содержать спец. символы ${specialChars}`,
  [MIN_LENGTH]: ({ minLength }) =>
    `Длина пароля должна быть не менее ${minLength} символов`,
  [MAX_LENGTH]: ({ maxLength }) =>
    `Длина пароля должна быть не более ${maxLength} символов`,
}

export const regexMap = {
  [WITH_INTEGER]: () => '(?=.*[0-9])',
  [WITH_UPPER_CASE]: () => '(?=.*[A-Z])',
  [WITH_LOWER_CASE]: () => '(?=.*[a-z])',
  [WITH_SPECIAL_CHARS]: () =>
    '(?=.*[(\'"~\\`^&.,:;?!*+%\\-=|<>@[\\]{}/\\\\_$#)])',
  [MIN_LENGTH]: (obj) => `(?=.{${obj[MIN_LENGTH]},})`,
}

export const max = ({ maxLength }) => ({
  name: VALIDATION_RULE_MAX,
  args: { max: maxLength },
})

const anotherRulesMap = {
  [MAX_LENGTH]: max,
}

const regexFunc = (obj, key, customRules) => {
  if (customRules[key]) {
    obj.reg[key] = regexMap[key](customRules)
  }

  return obj
}

const anotherRulesFunc = (obj, key, customRules) => {
  obj.anotherRules.push(anotherRulesMap[key](customRules))

  return obj
}

export const getRules = (key) => (obj) => (customRules) => {
  return anotherRulesMap[key]
    ? anotherRulesFunc(obj, key, customRules)
    : regexFunc(obj, key, customRules)
}
