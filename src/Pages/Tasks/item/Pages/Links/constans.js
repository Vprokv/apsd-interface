import { createContext } from 'react'

export const StateContext = createContext({
  close: () => null,
})

export const UpdateContext = createContext({
  update: () => null,
})
