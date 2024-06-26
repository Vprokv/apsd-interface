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
  const [{ information = [], permit = false }, setReferences] = useState({})
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
      const { data } = await api.post(URL_INFORMATION_LIST)
      setReferences(data)
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
                permit={permit}
                loadData={loadData}
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
          <SelectorRowComponent
            id={id}
            level={level}
            loadData={loadData}
            permit={permit}
            {...data}
          />
        )
      },
    [loadData, permit],
  )

  const renderedEntities = useMemo(
    () => information?.map(renderEntities()),
    [information, renderEntities],
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
        {permit && (
          <SecondaryBlueButton onClick={addFolder} className="w-48">
            Добавить папку
          </SecondaryBlueButton>
        )}
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
