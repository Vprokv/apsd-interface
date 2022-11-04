import React from 'react'

export const LoadContext = React.createContext({
  loadData: () => null,
})

export const TypeContext = React.createContext({
  type: '',
})
