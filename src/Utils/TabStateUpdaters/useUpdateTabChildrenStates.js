import { useCallback, useContext } from 'react'
import { useRecoilState } from 'recoil'
import { tabDataStorage } from '@Components/Logic/Tab/state'
import { CurrentTabContext } from '@Components/Logic/Tab'

const baseArr = []
const useUpdateCurrentTabChildrenStates = () => {
  const { currentTabID } = useContext(CurrentTabContext)
  const [, setTabDataState] = useRecoilState(tabDataStorage)
  return useCallback(
    (tabName = baseArr, newState) => {
      if (tabName.length > 0) {
        setTabDataState((prevState) => {
          const nextState = { ...prevState }

          tabName.forEach((name) => {
            const key = `${currentTabID}${name}`
            const state = nextState[key]

            if (state) {
              nextState[key] = { ...state, ...newState }
            }
          })

          return nextState
        })
      }
    },
    [currentTabID, setTabDataState],
  )
}

export default useUpdateCurrentTabChildrenStates
