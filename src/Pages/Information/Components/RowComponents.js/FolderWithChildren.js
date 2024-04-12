import React, { useCallback, useContext, useEffect, useState } from 'react'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import {
  ContHover,
  LeafContainer,
  StyledContextMenu,
  StyledItem,
  ThreeDotButton,
} from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'
import ThreeDotIcon from '@/Icons/ThreeDotIcon'
import ContextMenu from '@Components/Components/ContextMenu'
import { SetActionContext } from '@/Pages/Information/constans'
import CreateFolder from '@/Pages/Information/Components/CreateFolder'
import DeleteWindow from '@/Pages/Information/Components/DeleteFolder'
import EditFolderWindow from '@/Pages/Information/Components/EditFolder'
import CustomFileInputComponent from '@/Pages/Information/Components/CustomFileInputComponent'
import { ApiContext } from '@/contants'
import NewFileInput from '@/Components/Inputs/NewFileInput'
import { useOpenNotification } from '@/Components/Notificator'
import { URL_INFORMATION_FILE_ADD } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const FolderWithChildrenComponent = ({
  renderEntities,
  toggleDisplayedFlag,
  isDisplayed,
  childs,
  name,
  id,
  parentId,
  level,
  loadData,
}) => {
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState({})
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [values, setValues] = useState()
  const closeContextMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const openContextMenu = useCallback((event) => {
    setTarget(event.target)
    setOpen(true)
  }, [])

  const { setActionComponent } = useContext(SetActionContext)

  const addFolder = useCallback(() => {
    setActionComponent({
      Component: (props) => <CreateFolder {...props} parentId={parentId} />,
    })
    closeContextMenu()
  }, [closeContextMenu, parentId, setActionComponent])

  const EditFolder = useCallback(() => {
    setActionComponent({
      Component: (props) => <EditFolderWindow {...props} id={id} name={name} />,
    })
    closeContextMenu()
  }, [closeContextMenu, id, name, setActionComponent])

  const onDelete = useCallback(() => {
    setActionComponent({
      Component: (props) => <DeleteWindow {...props} id={id} />,
    })
    closeContextMenu()
  }, [closeContextMenu, id, setActionComponent])

  const addFile = useCallback(async () => {
    try {
      if (values) {
        await api.post(URL_INFORMATION_FILE_ADD, {
          parentId,
          files: values?.map(({ dsc_content, dss_content_name }) => ({
            id: dsc_content,
            name: dss_content_name,
          })),
        })
        getNotification(defaultFunctionsMap[200]())
        await loadData()
        closeContextMenu()
      }
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, closeContextMenu, getNotification, loadData, parentId, values])

  useEffect(addFile, [addFile])

  return (
    <>
      <LeafContainer
        key={id}
        subRow={level}
        className="flex flex-col w-full border-b-2"
      >
        <div className="flex">
          <button
            type="button"
            className="flex items-center min-h-10 py-2 "
            onClick={toggleDisplayedFlag}
          >
            <Icon
              icon={angleIcon}
              size={10}
              className={`color-text-secondary mr-1 ${
                isDisplayed ? '' : 'rotate-180'
              }`}
            />
            <span>{name}</span>
          </button>
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
                <NewFileInput
                  value={values}
                  onInput={setValues}
                  inputComponent={CustomFileInputComponent}
                  multiple={true}
                />
                <StyledItem className="mb-3 font-size-12" onClick={EditFolder}>
                  Редактировать
                </StyledItem>
                <StyledItem className="mb-3 font-size-12" onClick={onDelete}>
                  Удалить
                </StyledItem>
              </StyledContextMenu>
            </ContextMenu>
          )}
        </div>
      </LeafContainer>
      {isDisplayed && (
        <div className="flex flex-col">
          {childs.map(renderEntities(level + 1))}
        </div>
      )}
    </>
  )
}

export default FolderWithChildrenComponent
