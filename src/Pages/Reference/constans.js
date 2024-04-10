import { createContext } from 'react'

export const SetActionContext = createContext({
  ActionComponent: null,
  setActionComponent: () => null,
})
