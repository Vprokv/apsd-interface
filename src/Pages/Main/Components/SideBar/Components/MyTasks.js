import { useCallback, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { NavigationHeaderIcon } from '../style'
import NavigationDocumentIcon from '../icons/NavigationDocumentIcon'
import WithToggleNavigationItem from './withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'
import { TASK_LIST_PATH } from '@/routePaths'
import {
  EXPIRED,
  EXPIRED_1_3,
  EXPIRED_4_7,
  EXPIRED_8,
  EXPIRED_TODAY,
  TabNames,
} from '@/Pages/Tasks/list/constants'
import { useStatistic } from '@/Pages/Tasks/helper'
import { CurrentTabContext } from '@Components/Logic/Tab'

const MyTasks = ({ onOpenNewTab, onChangeActiveTab, task }) => {
  const { tabs } = useContext(CurrentTabContext)
  const statistic = useStatistic(task)

  const handleOpenNewTab = useCallback(
    (path) => () => {
      const tab = tabs.findIndex(({ pathname }) => pathname === path)
      return tab >= 0 ? onChangeActiveTab(tab) : onOpenNewTab(path)
    },
    [onChangeActiveTab, onOpenNewTab, tabs],
  )
  return (
    <WithToggleNavigationItem id="Мои задания">
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className="px-2 mb-4">
          <button
            className="flex items-center w-full"
            onClick={toggleDisplayedFlag}
          >
            <NavigationHeaderIcon icon={NavigationDocumentIcon} size={22} />
            <span className="font-size-12 mr-auto font-medium">
              Мои задания
            </span>
            <Icon
              icon={angleIcon}
              size={10}
              className={isDisplayed ? '' : 'rotate-180'}
            />
          </button>
          {isDisplayed && (
            <div className="font-size-12 mt-2">
              <button
                type="button"
                className="flex w-full py-1.5 color-blue-1"
                onClick={handleOpenNewTab(TASK_LIST_PATH)}
              >
                <span className="mr-auto">{TabNames['']}</span>
                <span className="font-medium">{statistic['']}</span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${TASK_LIST_PATH}${EXPIRED}`)}
              >
                <span className="mr-auto">{TabNames[EXPIRED]}</span>
                <span className="color-red font-medium">
                  {statistic[EXPIRED]}
                </span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${TASK_LIST_PATH}${EXPIRED_TODAY}`)}
              >
                <span className="mr-auto">{TabNames[EXPIRED_TODAY]}</span>
                <span>
                  <span className="font-medium">
                    {statistic[EXPIRED_TODAY].unread}
                  </span>
                  <span className="color-text-secondary">
                    /{statistic[EXPIRED_TODAY].all}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${TASK_LIST_PATH}${EXPIRED_1_3}`)}
              >
                <span className="mr-auto">{TabNames[EXPIRED_1_3]}</span>
                <span>
                  <span className="font-medium">
                    {statistic[EXPIRED_1_3].unread}
                  </span>
                  <span className="color-text-secondary">
                    /{statistic[EXPIRED_1_3].all}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${TASK_LIST_PATH}${EXPIRED_4_7}`)}
              >
                <span className="mr-auto">{TabNames[EXPIRED_4_7]}</span>
                <span>
                  <span className="font-medium">
                    {statistic[EXPIRED_4_7].unread}
                  </span>
                  <span className="color-text-secondary">
                    /{statistic[EXPIRED_4_7].all}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${TASK_LIST_PATH}${EXPIRED_8}`)}
              >
                <span className="mr-auto">{TabNames[EXPIRED_8]}</span>
                <span>
                  <span className="font-medium">
                    {statistic[EXPIRED_8].unread}
                  </span>
                  <span className="color-text-secondary">
                    /{statistic[EXPIRED_8].all}
                  </span>
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </WithToggleNavigationItem>
  )
}

MyTasks.propTypes = {
  onOpenNewTab: PropTypes.func.isRequired,
  onChangeActiveTab: PropTypes.func.isRequired,
  task: PropTypes.object,
}

export default MyTasks
