import { useMemo } from 'react'

const useFilters = ({ filters, ...props }) => {
  const { formPayload } = props
  const filtersMap = useMemo(
    () =>
      filters.reduce(
        (acc, { field, filter }) => {
          acc.keys.push(field)
          acc.targetKeys.push(filter)
          return acc
        },
        { keys: [], targetKeys: [] },
      ),
    [filters],
  )

  const deps = useMemo(
    () =>
      filtersMap.keys.reduce((acc, key) => {
        const { [key]: depValue } = formPayload
        acc.push(depValue)
        return acc
      }, []),
    [filtersMap, formPayload],
  )

  // создаем новый объект фильтра только при смене зависимостей
  return {
    ...props,
    filter: useMemo(
      () =>
        deps.reduce((acc, dependency, index) => {
          acc[filtersMap.targetKeys[index]] = dependency
          return acc
        }, {}),
      // eslint-disable-next-line
      [deps])
  }
}

export default useFilters
