import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ButtonForIcon } from '@/Pages/Main/Components/Header/Components/styles'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { ApiContext } from '@/contants'
import ScrollBar from '@Components/Components/ScrollBar'
import { LeafContainer } from '@/Pages/Rporting/styled'
import Tips from '@/Components/Tips'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import SelectorRowComponent from '@/Pages/Information/Components/RowComponents.js/SelectorRowComponent'
import FolderWithChildrenComponent from '@/Pages/Information/Components/RowComponents.js/FolderWithChildren'
import { SetActionContext } from '@/Pages/Information/constans'
import { URL_INFORMATION_LIST } from '@/ApiList'
import { SecondaryBlueButton } from '@/Components/Button'
import informationIcon from '@/Icons/Information'
import Icon from '@Components/Components/Icon'
import CreateFolder from '@/Pages/Information/Components/CreateFolder'

const Information = () => {
  const [open, setOpenState] = useState(false)
  const [references, setReferences] = useState([])
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [ActionComponent, setActionComponent] = useState(null)
  const closeAction = useCallback(() => setActionComponent(null), [])
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const loadData = useCallback(async () => {
    try {
      // const { data } = await api.post(URL_INFORMATION_LIST)
      // setReferences(data)
      setReferences([
        {
          id: 'string1', //- id записи
          parentId: 'string1', //- id родителя
          contentId: '', // - id контента, используется для получения предпросмотра из таблицы ddt_information
          name: 'level 1', //- имя папки или файла (зависит от заполнения contentId)
          mimeType: 'other', // - mimeType файла
          //[ - дочерние разделы
          childs: [
            {
              id: 'string3', //- id записи
              parentId: 'string', //- id родителя
              contentId: 'string', // - id контента, используется для получения предпросмотра из таблицы ddt_information
              name: 'level3', //- имя папки или файла (зависит от заполнения contentId)
              mimeType: 'other', // - mimeType файла
              //[ - дочерние разделы
              childs: [
                {
                  id: 'string4',
                  parentId: 'string',
                  contentId: 'string',
                  name: 'контент',
                  mimeType: 'other',
                  childs: [],
                  token: 'string',
                },
              ],
            },
          ],
        },
      ])
      changeModalState(true)()
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, changeModalState, getNotification])

  const onOpen = useCallback(async () => {
    await loadData()
    changeModalState(true)()
  }, [changeModalState, loadData])

  const renderEntities = useCallback(
    (level = 1) =>
      ({ childs, id, ...data }) => {
        return childs.length > 0 ? (
          <WithToggleNavigationItem id={id} key={id}>
            {({ isDisplayed, toggleDisplayedFlag }) => (
              <FolderWithChildrenComponent
                renderEntities={renderEntities}
                toggleDisplayedFlag={toggleDisplayedFlag}
                isDisplayed={isDisplayed}
                childs={childs}
                level={level}
                id={id}
                {...data}
              />
            )}
          </WithToggleNavigationItem>
        ) : (
          <SelectorRowComponent id={id} level={level} {...data} />
        )
      },
    [],
  )

  const renderedEntities = useMemo(
    () => references.map(renderEntities()),
    [references, renderEntities],
  )

  const addFolder = useCallback(
    () =>
      setActionComponent({
        Component: (props) => <CreateFolder {...props} />,
      }),
    [setActionComponent],
  )

  return (
    <LeafContainer>
      <Tips text="Справка">
        <ButtonForIcon onClick={onOpen}>
          <Icon size="22" icon={informationIcon} />
        </ButtonForIcon>
      </Tips>
      <StandardSizeModalWindow
        title="Справка"
        open={open}
        onClose={changeModalState(false)}
      >
        <ScrollBar className="pr-6 font-size-14">
          <SetActionContext.Provider
            value={{ ActionComponent, setActionComponent }}
          >
            {renderedEntities}
          </SetActionContext.Provider>
        </ScrollBar>
        <div>
          <SecondaryBlueButton onClick={addFolder}>
            Добавить папку
          </SecondaryBlueButton>
        </div>
        {ActionComponent && (
          <ActionComponent.Component
            open={true}
            onClose={closeAction}
            loadData={loadData}
          />
        )}
      </StandardSizeModalWindow>
    </LeafContainer>
  )
}

export default Information
