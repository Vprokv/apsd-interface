import { useMemo } from 'react'
import { useRecoilState } from 'recoil'
import { EntityMap, tabDataStorage } from '@Components/Logic/Tab/state'

const baseArr = []
const UseTabStateUpdaterByName = (tabName = baseArr) => {
  const [, setTabDataState] = useRecoilState(tabDataStorage)
  return useMemo(
    () =>
      tabName.length > 0
        ? (newState) => {
            setTabDataState((prevState) => {
              const nextState = { ...prevState }
              tabName.forEach((name) => {
                for (const tabId of EntityMap[name]) {
                  const key = `${name}${tabId}`
                  const state = nextState[key]
                  if (state) {
                    nextState[key] = { ...state, ...newState }
                  }
                }
              })

              return nextState
            })
          }
        : () => null,
    [setTabDataState, tabName],
  )
}

export default UseTabStateUpdaterByName
