import PropTypes from 'prop-types'
import { useRecoilState, useRecoilValue } from 'recoil'
import { cachedLocalStorageValue } from '@Components/Logic/Storages/localStorageCache'
import { useCallback, useContext, useEffect } from 'react'
import { URL_STORAGE_DOCUMENT, URL_STORAGE_TITLE } from '@/ApiList'
import { ApiContext } from '@/contants'
import { documentQuery } from './store'
import log from 'tailwindcss/lib/util/log'
import { array } from 'bfj/src/events'

const keys = {
  [URL_STORAGE_TITLE]: 'branchId',
  [URL_STORAGE_DOCUMENT]: 'titleId',
}

const WithToggleNavigationItem = ({ id, children, url }) => {
  const api = useContext(ApiContext)
  const [isDisplayed, setDisplayedFlag] = useRecoilState(
    cachedLocalStorageValue(`navigationItem${id}`),
  )

  const [child, setChild] = useRecoilState(documentQuery(id))

  useEffect(() => {
    !child &&
      url &&
      (async () => {
        const {
          data,
          data: { content = [] },
        } = await api.post(url, {
          filter: { [keys[url]]: id },
          limit: 10,
          offset: 0,
        })
        console.log(data, 'inc')
        // setChild(Array.isArray(data) ? data : content)
        setChild(data)
      })()
  }, [child])

  console.log(child, 'child')

  return children({
    isDisplayed,
    toggleDisplayedFlag: useCallback(() => setDisplayedFlag((s) => !s), []),
    child,
  })
}

WithToggleNavigationItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default WithToggleNavigationItem
