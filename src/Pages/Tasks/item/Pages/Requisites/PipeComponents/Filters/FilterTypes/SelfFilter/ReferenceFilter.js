import { forwardRef, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext } from '@/contants'

const cache = new Map()

const WithFiltersUserSelect = (Component, filters, functions, type) => {
  const WithFiltersUserSelect = (props, ref) => {
    const api = useContext(ApiContext)
    // const cache = useContext(CacheContext)

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
            if (!typeCache.has(field)) {
              if (functions) {
                const { [field]: resFunc = functions.defaultFunc } = functions
                const options = resFunc(api, filter)
                acc.promises.push(options)
                acc.keys.push(field)
                typeCache.set(field, options)
              }
            } else {
              const options = typeCache.get(field)
              acc.promises.push(options)
              acc.keys.push(field)
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

    return <Component ref={ref} {...props} filterOptions={customOptions} />
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
