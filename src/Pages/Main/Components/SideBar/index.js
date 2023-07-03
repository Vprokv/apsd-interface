import { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { NavigationHeaderIcon, SideBarContainer } from './style'
import Button from '@/Components/Button'
import Icon from '@Components/Components/Icon'

import plusIcon from '@/Icons/plusIcon'
import MyTasks from './Components/MyTasks'
import ViewedIcon from './icons/ViewedIcon'
import CreatedByMeIcon from './icons/CreatedByMeIcon'
import Storage from './Components/Storage'
import Archive from './Components/Archive'
import Basket from './Components/Basket'
import CreateDocumentWindow from './Components/CreateDocumentWindow'
import ScrollBar from '@Components/Components/ScrollBar'
import { TASK_VIEWED_LIST_PATH } from '@/routePaths'
import { useRecoilState } from 'recoil'
import { tasksAtom } from '@/Pages/Main/store'
import { URL_TASK_STATISTIC } from '@/ApiList'
import { ApiContext } from '@/contants'
import {
  NOTIFICATION_TYPE_ERROR,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { LoadTasks } from '@/Pages/Main/constants'
import Notification from '@/Pages/Main/Components/SideBar/Components/Notification'
import styled from 'styled-components'
import Knowledge from '@/Pages/Main/Components/SideBar/Components/KnowLedge'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  500: () => {
    return {
      type: NOTIFICATION_TYPE_ERROR,
      message: 'Не удалось загрузить данные статистики',
    }
  },
}
let timeout

const Resizer = styled.div`
  bottom: 0;
  right: 0;
  z-index: 2;
  cursor: e-resize;
  width: 3px;
  height: 100%;

  &:hover {
    &::after {
      display: block;
      content: '';
      height: 100%;
      width: 1px;
      background: var(--blue-1);
    }
  }
`

const SideBar = ({
  onOpenNewTab,
  onChangeActiveTab,
  onColumnStartResize,
  columnsWithUiSetting,
  children,
}) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [createDocumentWindow, setCreateDocumentWindowState] = useState(false)

  const openCreateDocumentWindow = useCallback(
    () => setCreateDocumentWindowState(true),
    [],
  )
  const closeCreateDocumentWindow = useCallback(
    () => setCreateDocumentWindowState(false),
    [],
  )
  const [task, updateTasks] = useRecoilState(tasksAtom)

  const loadTasks = useCallback(() => {
    const loadTask = async () => {
      clearTimeout(timeout)
      let attempts = 0
      const {
        data: [data],
        status,
      } = await api.post(URL_TASK_STATISTIC)
      try {
        if (status === 200) {
          // на случай кондишен рейса, первый запрос в процессе, прилетел другой и выполнился раньше и уже разместил свой таймер
          clearTimeout(timeout)
          timeout = setTimeout(loadTask, 300000)
          updateTasks(data)
        }
      } catch (e) {
        const { response: { status } = {} } = e
        if (attempts === 10) {
          getNotification(customMessagesFuncMap[status]())
        } else {
          // на случай кондишен рейса, первый запрос в процессе, прилетел другой и выполнился раньше и уже разместил свой таймер
          clearTimeout(timeout)
          timeout = setTimeout(loadTask, 300000)
        }
      }
    }
    return loadTask()
  }, [api, getNotification, updateTasks])

  useEffect(loadTasks, [loadTasks])

  return (
    <LoadTasks.Provider value={loadTasks}>
      <div className="flex h-full overflow-hidden">
        <SideBarContainer
          style={{ width: columnsWithUiSetting.width }}
          className="py-4 bg-white flex-container"
        >
          <Button
            className="mx-2 text-white bg-blue-1 flex items-center capitalize mb-4 "
            onClick={openCreateDocumentWindow}
          >
            <Icon className="mr-2 ml-auto" icon={plusIcon} size={10} />
            <span className="mr-auto font-size-12">Создать</span>
          </Button>
          <ScrollBar className="flex-container">
            <Notification onOpenNewTab={onOpenNewTab} />
            <MyTasks
              task={task}
              onOpenNewTab={onOpenNewTab}
              onChangeActiveTab={onChangeActiveTab}
            />
            <button
              onClick={() => onOpenNewTab(`${TASK_VIEWED_LIST_PATH}`)}
              className="flex items-center w-full px-2 mb-4"
            >
              <NavigationHeaderIcon
                className="color-blue-6"
                icon={ViewedIcon}
                size={22}
              />
              <span className="font-size-12 mr-auto font-medium">
                Просмотренные
              </span>
            </button>
            <div className="px-2 flex items-center w-full mb-6">
              <NavigationHeaderIcon
                className="mr-2"
                icon={CreatedByMeIcon}
                size={20}
              />
              <div className="font-size-12 mr-auto font-medium">
                Созданные мной
              </div>
            </div>
            <Knowledge
              onOpenNewTab={onOpenNewTab}
              width={columnsWithUiSetting.width}
            />
            <Archive
              onOpenNewTab={onOpenNewTab}
              width={columnsWithUiSetting.width}
            />
            <Basket onOpenNewTab={onOpenNewTab} />
            <CreateDocumentWindow
              open={createDocumentWindow}
              onClose={closeCreateDocumentWindow}
            />
          </ScrollBar>
        </SideBarContainer>
        <Resizer onMouseDown={onColumnStartResize} />
        {children}
      </div>
    </LoadTasks.Provider>
  )
}

SideBar.propTypes = {
  onOpenNewTab: PropTypes.func.isRequired,
  onChangeActiveTab: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default SideBar
