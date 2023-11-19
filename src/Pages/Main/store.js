import { atom } from 'recoil'

export const tasksAtom = atom({
  key: 'tasksAtom',
  default: undefined,
})

export const notificationSidebarAtom = atom({
  key: 'notificationSidebarAtom',
  default: undefined,
})
