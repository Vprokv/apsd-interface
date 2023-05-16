import { createContext } from 'react'

export const OpenWindowContext = createContext({
  open: false,
  setOpen: () => null,
})
