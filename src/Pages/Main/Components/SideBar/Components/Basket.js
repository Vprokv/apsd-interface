import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { NavigationHeaderIcon } from '../style'
import SidebarBasketIcon from '../icons/SidebarBasketIcon'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'
import WithToggleNavigationItem from './withToggleNavigationItem'
import { DELETED_LIST_PATH } from '@/routePaths'
import {
  DELETED_1,
  DELETED_3,
  DELETED_YEAR,
} from '@/Pages/Basket/list/constans'
import Tips from '@/Components/Tips'

const Basket = ({ onOpenNewTab, collapsedState }) => {
  const handleOpenNewTab = useCallback(
    (path) => () => onOpenNewTab(path),
    [onOpenNewTab],
  )

  return collapsedState ? (
    <Tips text="Все удаленные">
      <button
        type="button"
        className="flex w-full color-blue-1 px-2 mb-2"
        onClick={handleOpenNewTab(`${DELETED_LIST_PATH}`)}
      >
        <NavigationHeaderIcon
          icon={SidebarBasketIcon}
          size={28}
          className="mx-auto"
        />
      </button>
    </Tips>
  ) : (
    <WithToggleNavigationItem id="корзина">
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className="px-2 mb-2">
          <button
            className="flex items-center w-full "
            onClick={toggleDisplayedFlag}
          >
            <NavigationHeaderIcon
              icon={SidebarBasketIcon}
              size={22}
              className="mr-4"
            />
            <span className="font-size-12 mr-auto font-medium">Корзина</span>
            <Icon
              icon={angleIcon}
              size={10}
              className={`ml-1 ${isDisplayed ? '' : 'rotate-180'}`}
            />
          </button>
          {isDisplayed && (
            <div className="font-size-12 mt-4">
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${DELETED_LIST_PATH}`)}
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
  collapsedState: PropTypes.bool,
}

export default Basket
