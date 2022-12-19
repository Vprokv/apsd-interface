import { createContext } from 'react'

export const UpdateContext = createContext({
  update: () => null,
})

export const ShowAnswerButtonContext = createContext({
  answer: false,
})
