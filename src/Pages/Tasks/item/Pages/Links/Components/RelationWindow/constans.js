import { createContext } from 'react'

export const StateRelationContext = createContext({
  linkType: () => new Map(),
  comment: () => new Map(),
  onLink: () => null,
  onComment: () => null,
})
