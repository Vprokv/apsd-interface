import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { EntityMap, tabDataStorage } from '@Components/Logic/Tab/state'

const baseArr = []
const UseTabStateUpdaterByName = () => {
  const [, setTabDataState] = useRecoilState(tabDataStorage)
  return useCallback(
    (tabName = baseArr, newState) => {
      if (tabName.length > 0)
        setTabDataState((prevState) => {
          const nextState = { ...prevState }

          tabName.forEach((name) => {
            for (const tabId of EntityMap[name]) {
              const key = `${tabId}${name}`
              const state = nextState[key]

              if (state) {
                nextState[key] = { ...state, ...newState }
              }
            }
          })

          return nextState
        })
    },
    [setTabDataState],
  )
}

export default UseTabStateUpdaterByName
