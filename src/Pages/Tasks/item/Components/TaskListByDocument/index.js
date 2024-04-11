import React, { useCallback, useMemo, useState } from 'react'
import TaskListByDocumentIcon from '../../Icons/TaskListByDocumentIcon.svg'
import { StyledItem } from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'
import { useNavigate, useParams } from 'react-router-dom'
import Tips from '@/Components/Tips'
import { useRecoilState } from 'recoil'
import { cachedLocalStorageValue } from '@Components/Logic/Storages/localStorageCache'
import Icon from '@Components/Components/Icon'
import styled from 'styled-components'
import ContextMenu from '@Components/Components/ContextMenu'
import ListIcon from '@/Pages/Tasks/item/Components/TaskListByDocument/Icon'

export const StyledContextMenu = styled(ContextMenu)`
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  min-width: min-content;
  background-color: white;
`

const SortButton = styled.div`
  color: var(--text-secondary);

  &:hover {
    color: var(--blue-1);
  }
`
const iconMap = {
  true: () => (
    <div className="flex items-center">
      <img src={TaskListByDocumentIcon} alt="" />
    </div>
  ),
  false: () => (
    <SortButton>
      <Icon icon={ListIcon} height={19} width={19} />
    </SortButton>
  ),
}

const TaskListByDocument = ({ taskData }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const [target, setTarget] = useState({})
  const [sidebarExpanded = false] = useRecoilState(
    cachedLocalStorageValue('DocumentActionsState'),
  )
  const IconComponent = iconMap[sidebarExpanded]
  const { type } = useParams()

  const openContextMenu = useCallback((event) => {
    setTarget(event.target)
    setOpen(true)
  }, [])

  const taskList = useMemo(
    () => (
      <StyledContextMenu
        className="bg-white items-center"
        target={target}
        onClose={() => setOpen((prev) => !prev)}
      >
        {taskData.map(({ taskId, name }) => (
          <StyledItem
            key={taskId}
            onClick={() => navigate(`/task/${taskId}/${type}`)}
            className="my-2 mx-4 font-size-12 w-max bg-white"
          >
            {name}
          </StyledItem>
        ))}
      </StyledContextMenu>
    ),
    [navigate, target, taskData, type],
  )

  return (
    <div className="mx-4 mt-2">
      <Tips text="Список заданий по документу" className="w-40 content-center">
        <button
          className="flex items-center"
          type="button"
          onClick={openContextMenu}
        >
          <IconComponent />
          <div className="font-semibold">Мои задания</div>
        </button>
        {open && taskList}
      </Tips>
    </div>
  )
}

export default React.memo(TaskListByDocument)
