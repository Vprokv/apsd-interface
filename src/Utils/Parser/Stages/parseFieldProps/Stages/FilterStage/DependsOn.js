import { useMemo } from 'react'
import InterceptorsStage from '../../../InterceptorsStage'

const dependsOnFilter =
  (state) =>
  (fieldState) =>
  (filters, { attr, fieldName }) => {
    const interceptors = InterceptorsStage(state)
    filters.forEach(({ field }) =>
      interceptors({ field, targetKey: attr[fieldName] }),
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
        filter: useMemo(
          () =>
            filtersMap.keys.reduce(
              (acc, key, index) => {
                const { [key]: depValue } = formPayload
                acc[filtersMap.targetKeys[index]] = depValue
                return acc
              },
              { ...filter },
            ),
          [formPayload, filter],
        ),
      }
    })
  }
export default dependsOnFilter
