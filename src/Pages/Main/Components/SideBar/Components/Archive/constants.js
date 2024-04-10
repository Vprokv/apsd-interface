import { createContext } from 'react'

export const ContextArchiveContainerWidth = createContext(0)

export const ContextArchiveLoading = createContext({
  loading: {},
  setLoading: () => null,
  setLastSelected: () => null,
  lastSelected: null,
})
