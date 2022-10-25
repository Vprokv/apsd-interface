import React from 'react'

export const SedoContext = React.createContext({
  value: [],
  onInput: () => null,
})

export const EmailContext = React.createContext({
  value: [],
  onInput: () => null,
})

export const EventsContext = React.createContext({
  value: new Map(),
})

export const SubscribersContext = React.createContext({
  value: new Map(),
})
