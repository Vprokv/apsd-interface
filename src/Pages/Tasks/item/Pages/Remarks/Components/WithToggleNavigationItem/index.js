import { forwardRef, useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import memoize from 'lodash/memoize'
import { ToggleContext } from '@/Pages/Tasks/item/Pages/Remarks/constans'

export const WithToggleNavigationItem = ({
  isDisplayed,
  toggleDisplayedFlag,
  children,
}) => {
  return children({
    isDisplayed,
    toggleDisplayedFlag,
  })
}

const ToggleNavigationItemWrapper = memoize((Component) => {
  const ToggleNavigationItemWrapper = forwardRef(({ id, ...props }, ref) => {
    const { toggle, onToggle } = useContext(ToggleContext)

    const toggleDisplayedFlag = useCallback(
      () =>
        onToggle(({ [id]: current = true, ...map }) => {
          const prev = { ...map }

          return { ...prev, [id]: !current }
        }),
      [id, onToggle],
    )

    return (
      <Component
        isDisplayed={toggle[id]}
        toggleDisplayedFlag={toggleDisplayedFlag}
        ref={ref}
        {...props}
      />
    )
  })

  ToggleNavigationItemWrapper.propTypes = {}

  return ToggleNavigationItemWrapper
})

export default ToggleNavigationItemWrapper
