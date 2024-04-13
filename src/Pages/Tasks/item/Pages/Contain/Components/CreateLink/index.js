import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { ApiContext, TASK_ITEM_STRUCTURE } from '@/contants'
import { useParams } from 'react-router-dom'
import { URL_TITLE_CONTAIN, URL_TITLE_CONTAIN_CREATE_LINK } from '@/ApiList'
import ScrollBar from '@Components/Components/ScrollBar'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import { NestedButton } from '@/Pages/Tasks/item/Pages/Contain/styles'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import styled from 'styled-components'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import { setUnFetchedState, useTabItem } from '@Components/Logic/Tab'
import PropTypes from 'prop-types'

const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 61.6%;
  height: 72.65%;
  margin: auto;
  z-index: 2000;
`
const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Связь добавлена успешна',
    }
  },
}

const CreateLink = ({ addLinkState }) => {
  const [open, setOpen] = useState(false)
  const [entities, setTitles] = useState([])
  const [selected, setSelected] = useState(null)
  const getNotification = useOpenNotification()
  const api = useContext(ApiContext)
  const { id } = useParams()

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_STRUCTURE,
  })

  const changeOpenState = useCallback((state) => () => setOpen(state), [])

  const onClose = useCallback(() => {
    changeOpenState(false)()
    setSelected(null)
  }, [changeOpenState])

  const openWindow = useCallback(async () => {
    try {
      const { data } = await api.post(URL_TITLE_CONTAIN, {
        expand: true,
        titleId: id,
      })
      setTitles(data)
      changeOpenState(true)()
    } catch (e) {
      console.log(e)
    }
  }, [api, changeOpenState, id])

  const onCrateLink = useCallback(async () => {
    try {
      const response = await api.post(URL_TITLE_CONTAIN_CREATE_LINK, {
        titleId: id,
        source: addLinkState.id,
        target: selected,
      })
      setTabState(setUnFetchedState())
      getNotification(customMessagesFuncMap[response.status]())
      onClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    addLinkState.id,
    api,
    getNotification,
    id,
    onClose,
    selected,
    setTabState,
  ])

  useEffect(() => {
    if (addLinkState.id) {
      openWindow()
    }
  }, [addLinkState, openWindow])

  const renderEntities = useCallback(
    (level = 1) =>
      // eslint-disable-next-line react/prop-types
      ({ id, name, childs, tomId }) =>
        // eslint-disable-next-line react/prop-types
        childs.length > 0 ? (
          <WithToggleNavigationItem id={id} key={id}>
            {({ isDisplayed, toggleDisplayedFlag }) => (
              <div className={`flex flex-col w-full ${isDisplayed ? '' : ''}`}>
                <NestedButton
                  level={level}
                  type="button"
                  className={`flex items-center w-full h-10 border-b ${
                    selected === id ? 'bg-light-gray' : ''
                  }`}
                  onClick={() => setSelected(id)}
                >
                  <Icon
                    icon={angleIcon}
                    size={10}
                    onClick={toggleDisplayedFlag}
                    className={`${
                      isDisplayed ? 'rotate-180' : ''
                    } mt-1 color-text-secondary`}
                  />
                  <span className="mr-auto ml-2">{name}</span>
                </NestedButton>
                {isDisplayed && (
                  <div className="flex flex-col">
                    {childs.map(renderEntities(level + 1))}
                  </div>
                )}
              </div>
            )}
          </WithToggleNavigationItem>
        ) : (
          !tomId && (
            <NestedButton
              level={level}
              type="button"
              className={`flex items-center w-full h-10 border-b ${
                selected === id ? 'bg-light-gray' : ''
              }`}
              onClick={() => setSelected(id)}
            >
              <span className="mr-auto ml-2">{name}</span>
            </NestedButton>
          )
        ),
    [selected],
  )

  const renderedEntities = useMemo(
    () => entities.map(renderEntities()),
    [entities, renderEntities],
  )

  return (
    <StandardSizeModalWindow title="Связать" open={open} onClose={onClose}>
      <ScrollBar className="pr-6 font-size-14">{renderedEntities}</ScrollBar>
      <UnderButtons
        leftLabel="Отменить"
        rightLabel="Связать"
        rightFunc={onCrateLink}
        leftFunc={onClose}
      />
    </StandardSizeModalWindow>
  )
}

CreateLink.defaultProps = {
  addLinkState: PropTypes.object.isRequired,
}

export default CreateLink
