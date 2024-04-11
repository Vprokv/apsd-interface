import React, { useCallback, useContext, useState } from 'react'
import Icon from '@Components/Components/Icon'
import { SetActionContext } from '@/Pages/Information/constans'
import CreateFolder from '@/Pages/Information/Components/CreateFolder'
import EditFolderWindow from '@/Pages/Information/Components/EditFolder'
import DeleteWindow from '@/Pages/Information/Components/DeleteFolder'
import {
  ContHover,
  LeafContainer,
  StyledContextMenu,
  StyledItem,
  ThreeDotButton,
} from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'
import ThreeDotIcon from '@/Icons/ThreeDotIcon'
import ContextMenu from '@Components/Components/ContextMenu'

const FolderComponent = ({ name, id, parentId, level }) => {
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState({})
  const closeContextMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const openContextMenu = useCallback((event) => {
    setTarget(event.target)
    setOpen(true)
  }, [])

  const { setActionComponent } = useContext(SetActionContext)

  const addFolder = useCallback(
    () =>
      setActionComponent({
        Component: (props) => <CreateFolder {...props} parentId={parentId} />,
      }),
    [parentId, setActionComponent],
  )

  const EditFolder = useCallback(
    () =>
      setActionComponent({
        Component: (props) => (
          <EditFolderWindow {...props} id={id} name={name} />
        ),
      }),
    [id, name, setActionComponent],
  )

  const onDelete = useCallback(
    () =>
      setActionComponent({
        Component: (props) => <DeleteWindow {...props} id={id} />,
      }),
    [id, setActionComponent],
  )

  const addFile = useCallback(() => null, [])

  return (
    <LeafContainer
      key={id}
      subRow={level}
      className={'flex flex-col w-full  border-b-2'}
    >
      <button type="button" className="flex items-center h-4">
        <span>{name}</span>
        <ContHover>
          <ThreeDotButton>
            <Icon
              icon={ThreeDotIcon}
              size={14}
              className="color-white cursor-pointer "
              onClick={openContextMenu}
            />
          </ThreeDotButton>
        </ContHover>
        {open && (
          <ContextMenu width={130} target={target} onClose={closeContextMenu}>
            <StyledContextMenu className="bg-white rounded w-full px-4 pt-4 ">
              <StyledItem className="mb-3 font-size-12" onClick={addFolder}>
                Добавить папку
              </StyledItem>
              <StyledItem className="mb-3 font-size-12" onClick={addFile}>
                Добавить файл
              </StyledItem>
              <StyledItem className="mb-3 font-size-12" onClick={EditFolder}>
                Редактировать
              </StyledItem>
              <StyledItem className="mb-3 font-size-12" onClick={onDelete}>
                Удалить
              </StyledItem>
            </StyledContextMenu>
          </ContextMenu>
        )}
      </button>
    </LeafContainer>
  )
}

export default FolderComponent
