import { createContext } from 'react'

export const ContextArchiveContainerWidth = createContext(0)

export const ContextArchiveLoading = createContext({
  loading: undefined,
  setLoading: () => null,
})
