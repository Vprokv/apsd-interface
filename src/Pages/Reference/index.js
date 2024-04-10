import { useCallback, useContext, useMemo, useState } from 'react'
import { ButtonForIcon } from '@/Pages/Main/Components/Header/Components/styles'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { ApiContext, ITEM_TASK } from '@/contants'
import ScrollBar from '@Components/Components/ScrollBar'
import { useNavigate } from 'react-router-dom'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { LeafContainer } from '@/Pages/Rporting/styled'
import Tips from '@/Components/Tips'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import OpenedTaskWindow from '@/Pages/Rporting/Components/OpendedTaskWindow'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import SelectorRowComponent from '@/Pages/Reference/Components/RowComponents.js/SelectorRowComponent'
import FolderWithChildrenComponent from '@/Pages/Reference/Components/RowComponents.js/FolderWithChildren'
import { SetActionContext } from '@/Pages/Reference/constans'

const Reference = () => {
  const [open, setOpenState] = useState(false)
  const [references, setReferences] = useState([])
  const navigate = useNavigate()
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
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
      // const { data } = await api.post(URL_REPORTS_LIST)
      // setReferences(data)
      changeModalState(true)()
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [changeModalState, getNotification])

  const onOpen = useCallback(async () => {
    try {
      await loadData
      changeModalState(true)()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [changeModalState, getNotification, loadData])

  const onClick = useCallback(
    (id) => {
      openTabOrCreateNewTab(navigate(`/report/${id}`))
      changeModalState(false)()
    },
    [changeModalState, navigate, openTabOrCreateNewTab],
  )

  const renderEntities = useCallback(
    (level = 1) =>
      ({ childs, id, ...data }) =>
        childs.length > 0 ? (
          <WithToggleNavigationItem id={id} key={id}>
            {({ isDisplayed, toggleDisplayedFlag }) => (
              <FolderWithChildrenComponent
                renderEntities={renderEntities}
                toggleDisplayedFlag={toggleDisplayedFlag}
                isDisplayed={isDisplayed}
                childs={childs}
                id={id}
                {...data}
              />
            )}
          </WithToggleNavigationItem>
        ) : (
          <SelectorRowComponent id={id} {...data} />
        ),
    [],
  )

  const renderedEntities = useMemo(
    () => references.map(renderEntities()),
    [references, renderEntities],
  )

  return (
    <LeafContainer>
      <Tips text="Отчёты">
        <ButtonForIcon className="bg-blue-1" onClick={onOpen}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="1.5" y="1.5" width="3" height="13" rx="1" fill="white" />
            <rect x="6.5" y="6.5" width="3" height="8" rx="1" fill="white" />
            <rect x="11.5" y="8.5" width="3" height="6" rx="1" fill="white" />
          </svg>
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
        <OpenedTaskWindow />
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

export default Reference
