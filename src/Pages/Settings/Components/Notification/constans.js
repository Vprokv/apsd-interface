import { createContext } from 'react'

export const ChannelContext = createContext({
  channels: [],
  loadFunction: () => null,
})
