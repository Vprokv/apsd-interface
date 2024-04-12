import React, { useCallback, useContext, useEffect, useState } from 'react'
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
import { URL_INFORMATION_FILE_ADD } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { ApiContext } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import NewFileInput from '@/Components/Inputs/NewFileInput'
import CustomFileInputComponent from '@/Pages/Information/Components/CustomFileInputComponent'

const FolderComponent = ({ name, id, parentId, level, loadData }) => {
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

  const addFolder = useCallback(
    () =>
      setActionComponent({
        Component: (props) => <CreateFolder {...props} parentId={id} />,
      }),
    [id, setActionComponent],
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

  const addFile = useCallback(async () => {
    try {
      if (values) {
        await api.post(URL_INFORMATION_FILE_ADD, {
          parentId: id,
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
  }, [api, closeContextMenu, getNotification, id, loadData, values])

  useEffect(addFile, [addFile])

  return (
    <LeafContainer
      key={id}
      subRow={level}
      className={'flex flex-col w-full  border-b-2'}
    >
      <button type="button" className="flex h-full items-center min-h-12 py-2">
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
      </button>
    </LeafContainer>
  )
}

export default FolderComponent
