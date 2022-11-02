import { useMemo } from 'react'
import PropTypes from 'prop-types'

export const WithFiltersUserSelect = (Component) => {
  const WithFiltersUserSelect = ({ filters, ...props }) => {
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
    const filter = useMemo(
      () =>
        deps.reduce((acc, dependency, index) => {
          acc[filtersMap.targetKeys[index]] = dependency
          return acc
        }, {}),
      // eslint-disable-next-line
     [deps])

    return <Component {...props} filter={filter} />
  }

  WithFiltersUserSelect.propTypes = {
    filters: PropTypes.array.isRequired,
    formPayload: PropTypes.object.isRequired,
  }

  return WithFiltersUserSelect
}
