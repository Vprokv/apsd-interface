import { useCallback, useContext, useMemo } from 'react'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import { ApiContext } from '@/contants'
import { URL_SEARCH_LIST } from '@/ApiList'

const useButtonFunc = (key) => {
  const {
    tabState: { filter, value },
    setTabState,
  } = useContext(TabStateContext)
  const api = useContext(ApiContext)

  console.log(filter, 'filter in tab state')

  const searchData = useMemo(() => {
    const queryItems = Object.keys(filter).reduce((acc, val) => {
      acc.push({
        attr: val,
        operator: 'STARTS_WITH',
        arguments: [filter[val]],
      })
      return acc
    })

    return {
      types: [value],
      inVersions: false,
      queryItems,
    }
  }, [filter, value])

  const onSearch = useCallback(async () => {
    const { data } = api.post(URL_SEARCH_LIST, searchData)
    setTabState({ searchValues: data })
  }, [api, searchData, setTabState])

  const functions = {
    search: onSearch,
  }

  return functions[key] ?? (() => null)
}

export default useButtonFunc
