import { createContext } from 'react'
import { VALIDATION_RULE_MAX } from '@Components/Logic/Validator/constants'

export const UpdateContext = createContext({
  update: () => null,
})

export const ShowAnswerButtonContext = createContext({
  answer: false,
})

export const ToggleContext = createContext({
  toggle: new Map(),
  onToggle: () => null,
})

export const remarkValidator = {
  [VALIDATION_RULE_MAX]: {
    resolver: ({ value, args: { max } }) =>
      typeof value === 'string' && max - value.length >= 0,
    message: ({
      args: { text = 'Преышено допустимое количество символов' },
    }) => {
      return text
    },
  },
}
