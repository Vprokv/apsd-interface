import { useMemo } from 'react'
import InterceptorsStage from '../../../InterceptorsStage'

const dependsOnFilter =
  (state) =>
  (fieldState) =>
  (filters, { attr }) => {
    const interceptors = InterceptorsStage(state)
    filters.forEach(({ field }) =>
      interceptors({ field, targetKey: attr.dss_attr_name }),
    )

    const filtersMap = filters.reduce(
      (acc, { field, filter }) => {
        acc.keys.push(field)
        acc.targetKeys.push(filter)
        return acc
      },
      { keys: [], targetKeys: [] },
    )

    fieldState.hooks.push(({ formPayload, filter }) => {
      return {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        filter: useMemo(() => {
          return filtersMap.keys.reduce(
            (acc, key, index) => {
              const { [key]: depValue } = formPayload
              acc[filtersMap.targetKeys[index]] = depValue
              return acc
            },
            { ...filter },
          )
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [...filtersMap.keys.map((key) => formPayload[key]), filter]),
      }
    })
  }
export default dependsOnFilter
