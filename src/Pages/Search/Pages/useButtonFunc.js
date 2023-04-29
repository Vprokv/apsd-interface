import { useCallback, useContext, useMemo } from 'react'
import { ApiContext } from '@/contants'
import { URL_SEARCH_LIST } from '@/ApiList'

const useButtonFunc = ({
  tabState: { filter = {}, value },
  setTabState,
  operator,
}) => {
  const api = useContext(ApiContext)

  const searchData = useMemo(() => {
    const queryItems =
      !!Object.keys(filter)?.length &&
      Object.keys(filter).reduce((acc, val) => {
        acc.push({
          attr: val,
          operator: operator.get(val)?.ID || 'CONTAINS',
          arguments: [filter[val]],
        })
        return acc
      }, [])

    return {
      types: ['ddt_project_calc_type_doc'],
      inVersions: false,
      queryItems,
    }
  }, [filter, operator])

  const onSearch = useCallback(async () => {
    const {
      data: { results },
    } = await api.post(URL_SEARCH_LIST, searchData)
    setTabState({ searchValues: results })
    // setTabState({ searchValues })
  }, [api, searchData, setTabState])

  const onRemove = useCallback(() => setTabState({ filter: {} }), [setTabState])

  const functions = {
    search: onSearch,
    delete: onRemove,
  }

  return (key) => functions[key] ?? (() => null)
}

useButtonFunc.defaultProps = {
  filter: {},
  value: '',
  setTabState: () => null,
}

export default useButtonFunc
