import React from 'react'

export const TabStateContext = React.createContext({
  tabState: {
    data: [],
    value: '',
    filter: {},
    searchValues: [],
  },
  setTabState: () => null,
})
