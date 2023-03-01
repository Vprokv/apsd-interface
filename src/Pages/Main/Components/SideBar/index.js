import { useCallback, useState } from 'react'
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
import { TASK_LIST_PATH, TASK_VIEWED_LIST_PATH } from '@/routePaths'
import { EXPIRED } from '@/Pages/Tasks/list/constants'

const SideBar = ({ onOpenNewTab, onChangeActiveTab }) => {
  const [createDocumentWindow, setCreateDocumentWindowState] = useState(false)
  const openCreateDocumentWindow = useCallback(
    () => setCreateDocumentWindowState(true),
    [],
  )
  const closeCreateDocumentWindow = useCallback(
    () => setCreateDocumentWindowState(false),
    [],
  )
  return (
    <SideBarContainer className="py-4 bg-light-gray flex-container">
      <Button
        className="mx-2 text-white bg-blue-1 flex items-center capitalize mb-4 "
        onClick={openCreateDocumentWindow}
      >
        <Icon className="mr-2 ml-auto" icon={plusIcon} size={10} />
        <span className="mr-auto">Создать</span>
      </Button>
      <ScrollBar className="flex-container">
        <MyTasks
          onOpenNewTab={onOpenNewTab}
          onChangeActiveTab={onChangeActiveTab}
        />
        <button
          onClick={() => onOpenNewTab(`${TASK_VIEWED_LIST_PATH}`)}
          className="flex items-center w-full px-2 mb-4"
        >
          <NavigationHeaderIcon className="" icon={ViewedIcon} size={22} />
          <span className="font-size-14 mr-auto font-medium">
            Просмотренные
          </span>
        </button>
        <div className="px-2 flex items-center w-full mb-6">
          <NavigationHeaderIcon
            className="mr-2"
            icon={CreatedByMeIcon}
            size={20}
          />
          <div className="font-size-14 mr-auto font-medium">Созданные мной</div>
        </div>
        <Storage />
        <Archive onOpenNewTab={onOpenNewTab} />
        <Basket onOpenNewTab={onOpenNewTab} />
        <CreateDocumentWindow
          open={createDocumentWindow}
          onClose={closeCreateDocumentWindow}
        />
      </ScrollBar>
    </SideBarContainer>
  )
}

SideBar.propTypes = {
  onOpenNewTab: PropTypes.func.isRequired,
}

export default SideBar
