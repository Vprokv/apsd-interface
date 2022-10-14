import { atom, selectorFamily, useRecoilState } from 'recoil'
import { URL_STORAGE_TITLE } from '@/ApiList'

export const dataCache = atom({
  key: 'dataCache',
  default: {},
})

export const documentQuery = selectorFamily({
  key: 'documentData',
  get:
    (key) =>
    ({ get }) => {
      let val = get(dataCache)[key]
      if (!val) {
        val = undefined
      }
      return val
    },
  set:
    (key) =>
    ({ set, get }, newValue) => {
      set(dataCache, { ...get(dataCache), [key]: newValue })
    },
})
