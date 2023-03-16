import { createContext } from 'react'

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
