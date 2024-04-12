import {
  maxLength as maxLengthRule,
  minLength as minLengthRule,
  required,
  same,
} from '@Components/Logic/Validator'
import { LoginInput } from '@/Pages/Login/styles'
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

export const rulesTransmission = {
  [MAX_LENGTH]: ({ maxLength }) => ({
    validatorObject: maxLengthRule,
    args: { max: maxLength },
  }),
  [MIN_LENGTH]: ({ minLength }) => ({
    validatorObject: minLengthRule,
    args: { min: minLength },
  }),
}

export const rules = {
  new_password: [
    { validatorObject: required },
    {
      validatorObject: same,
      args: {
        fieldKey: 'confirmation_password',
        fieldKeyLabel: 'пароль',
      },
    },
  ],
  confirmation_password: [
    { validatorObject: required },
    {
      validatorObject: same,
      args: { fieldKey: 'new_password', fieldKeyLabel: 'пароль' },
    },
  ],
}

export const fieldMap = [
  {
    label: 'Новый пароль',
    id: 'new_password',
    type: 'password',
    component: LoginInput,
    placeholder: 'Введите свой пароль',
  },
  {
    label: 'Подтверждение',
    id: 'confirmation_password',
    type: 'password',
    component: LoginInput,
    placeholder: 'Подтвердите пароль',
  },
]
