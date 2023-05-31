import { forwardRef, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext } from '@/contants'

const WithFiltersUserSelect = (
  Component,
  filters,
  functions,
  type,
  configFilter,
) => {
  const filtersMap = filters.reduce(
    (acc, { field, filter }) => {
      acc.keys.push(field)
      acc.targetKeys.push(filter)
      return acc
    },
    { keys: [], targetKeys: [] },
  )

  const cache = new Map()
  const WithFiltersUserSelect = (props, ref) => {
    const api = useContext(ApiContext)
    const { formPayload, filter, filterOptions } = props

    const [customOptions, setCustomOptions] = useState({})

    useEffect(() => {
      ;(async () => {
        if (!cache.has(type)) {
          cache.set(type, new Map())
        }
        const typeCache = cache.get(type)
        const nextFilters = {}

        const { promises, keys } = filters.reduce(
          (acc, { filter, field }) => {
            if (!typeCache.has(filter)) {
              if (functions) {
                const { [filter]: resFunc = functions.defaultFunc } = functions
                const options = resFunc(api, filter, configFilter)
                acc.promises.push(options)
                acc.keys.push(filter)
                typeCache.set(filter, options)
              }
            } else {
              const options = typeCache.get(filter)
              acc.promises.push(options)
              acc.keys.push(filter)
            }
            return acc
          },
          { promises: [], keys: [] },
        )

        const result = await Promise.all(promises)

        result.forEach((val, key) => {
          nextFilters[keys[key]] = val
        })

        setCustomOptions(nextFilters)
      })()
    }, [api])

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
        filterOptions={{ ...filterOptions, ...customOptions }}
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
    filterOptions: PropTypes.object,
  }

  WithFiltersUserSelect.defaultProps = {
    formPayload: {},
    filter: {},
  }

  return forwardRef(WithFiltersUserSelect)
}

export default WithFiltersUserSelect
