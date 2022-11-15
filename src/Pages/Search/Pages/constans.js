import React from 'react'

export const TabStateContext = React.createContext({
  tabState: {
    data: [],
    filter: {},
    searchValues: [],
  },
  checked: new Map(),
  value: '',
  getButtonFunc: () => () => {},
  setTabState: () => null,
  setChecked: () => null,
})
