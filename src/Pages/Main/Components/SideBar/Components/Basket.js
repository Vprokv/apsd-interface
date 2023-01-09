import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { NavigationHeaderIcon } from '../style'
import SidebarBasketIcon from '../icons/SidebarBasketIcon'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'
import WithToggleNavigationItem from './withToggleNavigationItem'
import { DELETED_LIST_PATH, TASK_LIST_PATH } from '@/routePaths'
import { EXPIRED } from '@/Pages/Tasks/list/constants'
import {
  DELETED_1,
  DELETED_3,
  DELETED_YEAR,
} from '@/Pages/Basket/list/constans'

const Basket = ({ onOpenNewTab }) => {
  const handleOpenNewTab = useCallback(
    (path) => () => onOpenNewTab(path),
    [onOpenNewTab],
  )

  return (
    <WithToggleNavigationItem id="корзина">
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className="px-2 mb-4">
          <button
            className="flex items-center w-full "
            onClick={toggleDisplayedFlag}
          >
            <NavigationHeaderIcon icon={SidebarBasketIcon} size={22} />
            <span className="font-size-14 mr-auto font-medium">Корзина</span>
            <Icon
              icon={angleIcon}
              size={10}
              className={`ml-1 ${isDisplayed ? '' : 'rotate-180'}`}
            />
          </button>
          {isDisplayed && (
            <div className="font-size-12 mt-2">
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(DELETED_LIST_PATH)}
              >
                <span className="mr-auto">Все удаленные</span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${DELETED_LIST_PATH}${DELETED_1}`)}
              >
                <span className="mr-auto">Удаленные за 1 мес.</span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${DELETED_LIST_PATH}${DELETED_3}`)}
              >
                <span className="mr-auto">Удаленные за 3 мес.</span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(
                  `${DELETED_LIST_PATH}${DELETED_YEAR}`,
                )}
              >
                <span className="mr-auto">Удаленные за 1 год</span>
              </button>
            </div>
          )}
        </div>
      )}
    </WithToggleNavigationItem>
  )
}

Basket.propTypes = {
  onOpenNewTab: PropTypes.func.isRequired,
}

export default Basket
