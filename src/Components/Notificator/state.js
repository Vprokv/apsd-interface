import { atom, selector } from 'recoil'

export const notificationAtom = atom({
  key: 'notificationAtom',
  default: [],
})

export const notificationsSelector = selector({
  key: 'notificationsSelector',
  get: ({ get }) => get(notificationAtom),
  set: ({ set, get }, newNotification) =>
    set(notificationAtom, [...get(notificationAtom), newNotification]),
})
