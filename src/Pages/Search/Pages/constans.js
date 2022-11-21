import React from 'react'

export const TabStateContext = React.createContext({
  tabState: {
    data: [],
    filter: {},
    searchValues: [],
  },
  operator: new Map(),
  setOperator: () => null,
  checked: new Map(),
  value: '',
  getButtonFunc: () => () => {},
  setTabState: () => null,
  setChecked: () => null,
})
