import React from 'react'

export const MultipleContext = React.createContext({
  multiple: false,
  setSelected: () => null,
  selected: [],
})
