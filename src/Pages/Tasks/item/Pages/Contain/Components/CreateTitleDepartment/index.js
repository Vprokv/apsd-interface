import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import Button, {
  LoadableBaseButton,
  LoadableSecondaryBlueButton,
} from '@/Components/Button'
import ScrollBar from '@Components/Components/ScrollBar'
import Icon from '@Components/Components/Icon'
import { ApiContext, TASK_ITEM_STRUCTURE } from '@/contants'
import {
  URL_TITLE_CONTAIN_CREATE,
  URL_TITLE_CONTAIN_DEPARTMENT,
} from '@/ApiList'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import NewTitle from '@/Pages/Tasks/item/Pages/Contain/Components/CreateTitleDepartment/Components/NewTitle'
import { useParams } from 'react-router-dom'
import { NestedButton } from '../../styles'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Документ добавлен успешно',
    }
  },
}

const CreateTitleDepartment = ({
  className,
  addDepartmentState,
  onAddDepartment,
}) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [open, setOpenState] = useState(false)
  const [openTitle, setOpenTitleState] = useState(false)
  const [entities, setEntities] = useState([])
  const [selected, setSelected] = useState(null)
  const getNotification = useOpenNotification()
  const changeModalState = useCallback((nextState) => {
    setOpenState(nextState)
  }, [])

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_STRUCTURE,
  })

  const handleCancel = useCallback(() => {
    addDepartmentState.onCancel()
    changeModalState(false)
  }, [addDepartmentState, changeModalState])

  const handleClose = useCallback(
    (data) => {
      addDepartmentState.onCreate(data)
      changeModalState(false)
    },
    [addDepartmentState, changeModalState],
  )

  const changeModalStateTitle = useCallback(
    (nextState) => () => {
      setOpenTitleState(nextState)
    },
    [],
  )

  const openModalWindow = useCallback(async () => {
    try {
      const { data } = await api.post(URL_TITLE_CONTAIN_DEPARTMENT)
      setEntities(data)
      changeModalState(true)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, changeModalState, getNotification])

  const handleAddDepartment = useCallback(() => {
    onAddDepartment()
    return openModalWindow()
  }, [onAddDepartment, openModalWindow])

  useEffect(() => {
    if (addDepartmentState.id) {
      openModalWindow()
    }
  }, [addDepartmentState, openModalWindow])

  const handleClick = useCallback(async () => {
    try {
      const response = await api.post(URL_TITLE_CONTAIN_CREATE, {
        titleId: id,
        partId: selected,
        parentId: addDepartmentState.id,
      })
      setSelected(null)
      getNotification(customMessagesFuncMap[response.status]())
      changeModalState(false)
      setTabState(setUnFetchedState())
      // handleClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    id,
    selected,
    addDepartmentState.id,
    getNotification,
    changeModalState,
    setTabState,
  ])

  const renderEntities = useCallback(
    (level = 1) =>
      // eslint-disable-next-line react/prop-types
      ({ id, name, sections }) =>
        // eslint-disable-next-line react/prop-types
        sections.length > 0 ? (
          <WithToggleNavigationItem id={id} key={id}>
            {({ isDisplayed, toggleDisplayedFlag }) => (
              <div className={`flex flex-col w-full ${isDisplayed ? '' : ''}`}>
                <NestedButton
                  level={level}
                  type="button"
                  className={`flex items-center w-full border-b mr-2 ${
                    selected === id ? 'bg-light-gray' : ''
                  }`}
                  onClick={() => setSelected(id)}
                >
                  <div className="flex items-center h-full min-h-full py-2">
                    <Icon
                      icon={angleIcon}
                      size={10}
                      onClick={toggleDisplayedFlag}
                      className={`${
                        isDisplayed ? 'rotate-180 h-full' : ''
                      } mt-1 mr-1 color-text-secondary`}
                    />
                    <div className="text-left flex items-center h-full">
                      {name}
                    </div>
                  </div>
                </NestedButton>
                {isDisplayed && (
                  <div className="flex flex-col justify-start">
                    {sections.map(renderEntities(level + 1))}
                  </div>
                )}
              </div>
            )}
          </WithToggleNavigationItem>
        ) : (
          <NestedButton
            level={level}
            type="button"
            className={`flex items-center h-full border-b ${
              selected === id ? 'bg-light-gray' : ''
            }`}
            onClick={() => setSelected(id)}
          >
            <div className="text-left h-full flex items-center py-2 ">{name}</div>
          </NestedButton>
        ),
    [selected],
  )

  const renderedEntities = useMemo(
    () => entities.map(renderEntities()),
    [entities, renderEntities],
  )

  return (
    <>
      <LoadableSecondaryBlueButton
        className={className}
        onClick={handleAddDepartment}
      >
        Раздел
      </LoadableSecondaryBlueButton>
      <StandardSizeModalWindow
        title="Выбор разделов титула"
        open={open}
        onClose={handleCancel}
      >
        <ScrollBar className="pr-6 font-size-14">{renderedEntities}</ScrollBar>
        <div className="flex ml-auto">
          <Button
            className="bg-form-input-color flex items-center w-60 rounded-lg justify-center"
            onClick={handleCancel}
          >
            Отменить
          </Button>
          <LoadableBaseButton
            className="ml-2 text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center"
            onClick={changeModalStateTitle(true)}
          >
            Создать новый
          </LoadableBaseButton>
          <NewTitle
            open={openTitle}
            onClose={changeModalStateTitle(false)}
            parentId={addDepartmentState.id}
            closeParent={handleClose}
          />
          <LoadableBaseButton
            className="ml-2 text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center"
            onClick={handleClick}
          >
            Выбрать
          </LoadableBaseButton>
        </div>
      </StandardSizeModalWindow>
    </>
  )
}

CreateTitleDepartment.propTypes = {
  className: PropTypes.string,
  addDepartmentState: PropTypes.shape({
    onCreate: PropTypes.func,
    onCancel: PropTypes.func,
    id: PropTypes.string,
  }),
  onAddDepartment: PropTypes.func.isRequired,
}

CreateTitleDepartment.defaultProps = {
  addDepartmentState: {},
  className: '',
}

export default CreateTitleDepartment
