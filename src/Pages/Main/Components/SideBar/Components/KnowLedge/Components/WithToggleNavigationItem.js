import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'

const WithToggleNavigationItem = ({ id, children }) => {
  const [isDisplayed, setDisplayedFlag] = useState(false)

  return children({
    isDisplayed,
    toggleDisplayedFlag: useCallback(() => {
      setDisplayedFlag((s) => !s)
    }, [setDisplayedFlag]),
  })
}

WithToggleNavigationItem.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
}

export default WithToggleNavigationItem
