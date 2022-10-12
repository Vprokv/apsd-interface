import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { NavigationHeaderIcon } from '../style'
import NavigationDocumentIcon from '../icons/NavigationDocumentIcon'
import WithToggleNavigationItem from './withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'
import { TASK_LIST_PATH } from '../../../../../routePaths'
import { URL_TASK_STATISTIC } from '../../../../../ApiList'
import {
  EXPIRED,
  EXPIRED_1_3,
  EXPIRED_4_7,
  EXPIRED_8,
  TabNames,
} from '../../../../Tasks/list/constants'
import { ApiContext } from '../../../../../contants'
import { useStatistic } from '../../../../Tasks/helper'

const MyTasks = ({ onOpenNewTab }) => {
  const api = useContext(ApiContext)
  const { statistic, setStatistic } = useStatistic()

  useEffect(() => {
    async function fetchData() {
      const {
        data: [data],
      } = await api.post(URL_TASK_STATISTIC)
      setStatistic(data)
    }

    fetchData()
  }, [api, setStatistic])

  const handleOpenNewTab = useCallback(
    (path) => () => onOpenNewTab(path),
    [onOpenNewTab],
  )
  return (
    <WithToggleNavigationItem id="Мои задания">
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className="mb-4">
          <button
            className="flex items-center w-full"
            onClick={toggleDisplayedFlag}
          >
            <NavigationHeaderIcon icon={NavigationDocumentIcon} size={24} />
            <span className="font-size-14 mr-auto font-medium">
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

MyTasks.propTypes = {}

export default MyTasks
