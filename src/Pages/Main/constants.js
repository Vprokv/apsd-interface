import { createContext } from 'react'

export const LoadTasks = createContext(() => null)
export const MoveSideBar = createContext({
  moveSideBarState: () => null,
  setMoveSideBarState: () => null,
})
