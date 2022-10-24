import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
import { cachedLocalStorageValue } from '@Components/Logic/Storages/localStorageCache'
import { useCallback } from 'react'

const WithToggleNavigationItem = ({ id, children, func }) => {
  const [isDisplayed, setDisplayedFlag] = useRecoilState(
    cachedLocalStorageValue(`navigationItem${id}`),
  )
  return children({
    isDisplayed,
    toggleDisplayedFlag: useCallback(() => {
      setDisplayedFlag((s) => !s)
      func(id)
    }, [setDisplayedFlag]),
  })
}

WithToggleNavigationItem.defaultProps = {
  func: (id) => null,
}

WithToggleNavigationItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default WithToggleNavigationItem
