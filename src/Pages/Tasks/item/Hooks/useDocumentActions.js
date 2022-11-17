import { useMemo } from 'react'

const useDocumentActions = (documentTabs, handlers) =>
  useMemo(
    () =>
      (documentTabs || []).reduce((acc, action) => {
        const { name, caption } = action
        const { defaultHandler, [name]: handler } = handlers
        if (handler) {
          acc.push({
            key: name,
            caption,
            ...handler,
          })
        } else if (defaultHandler) {
          acc.push({
            key: name,
            caption,
            ...defaultHandler(action),
          })
        }
        return acc
      }, []),
    [documentTabs, handlers],
  )

export default useDocumentActions
