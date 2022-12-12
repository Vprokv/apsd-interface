import { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'

const WithFiltersUserSelect = (Component, filters) => {
  const filtersMap = filters.reduce(
    (acc, { field, filter }) => {
      acc.keys.push(field)
      acc.targetKeys.push(filter)
      return acc
    },
    { keys: [], targetKeys: [] },
  )
  const WithFiltersUserSelect = (props, ref) => {
    const { formPayload, filter } = props

    const deps = useMemo(
      () =>
        filtersMap.keys.reduce((acc, key) => {
          const { [key]: depValue } = formPayload
          acc.push(depValue)
          return acc
        }, []),
      [formPayload],
    )

    return (
      <Component
        ref={ref}
        {...props}
        filter={useMemo(
          () =>
            deps.reduce(
              (acc, dependency, index) => {
                acc[filtersMap.targetKeys[index]] = dependency
                return acc
              },
              { ...filter },
            ),
          [deps, filter],
        )}
      />
    )
  }

  WithFiltersUserSelect.propTypes = {
    formPayload: PropTypes.object,
    filter: PropTypes.object,
  }

  WithFiltersUserSelect.defaultProps = {
    formPayload: {},
    filter: {},
  }

  return forwardRef(WithFiltersUserSelect)
}

export default WithFiltersUserSelect
