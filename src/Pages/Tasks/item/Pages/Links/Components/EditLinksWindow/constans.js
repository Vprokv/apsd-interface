import { createContext, useCallback } from 'react'

export const EditLinkContext = createContext({
  comment: () => new Map(),
  link: new Map(),
  date: new Map(),
  onComment: () => null,
  onLink: () => null,
  onDate: () => null,
})

export const useActions = ({
  comment,
  link,
  date,
  setComment,
  setLink,
  setDate,
}) => {
  const defaultFunc = (action, setAction) => (val) => (a) => {
    const prevChecked = new Map(action)
    return setAction(prevChecked.set(val, a))
  }
  return {
    comment,
    onComment: useCallback(
      () => defaultFunc(comment, setComment),
      [comment, setComment],
    ),
    link,
    onLink: useCallback(() => defaultFunc(link, setLink), [link, setLink]),
    date,
    onDate: useCallback(() => defaultFunc(date, setDate), [date, setDate]),
  }
}
