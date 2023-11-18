import React from 'react'

export const LoadContext = React.createContext({
  loadData: () => null,
})

export const TypeContext = React.createContext({
  type: '',
})

export const CanAddContext = React.createContext({
  canAdd: false,
})

export const PermitDisableContext = React.createContext({
  permit: false,
})

