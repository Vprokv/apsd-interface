import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import Button, {
  LoadableBaseButton,
  LoadableSecondaryBlueButton,
} from '@/Components/Button'
import ScrollBar from '@Components/Components/ScrollBar'
import Icon from '@Components/Components/Icon'
import { ApiContext } from '@/contants'
import {
  URL_TITLE_CONTAIN_CREATE,
  URL_TITLE_CONTAIN_DEPARTMENT,
} from '@/ApiList'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import NewTitle from '@/Pages/Tasks/item/Pages/Contain/Components/CreateTitleDepartment/Components/NewTitle'
import { useParams } from 'react-router-dom'
import { NestedButton } from '../../styles'

const CreateTitleDepartment = ({ className, setChange, parentId }) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [open, setOpenState] = useState(false)
  const [openTitle, setOpenTitleState] = useState(false)
  const [entities, setEntities] = useState([])
  const [selected, setSelected] = useState(null)
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const changeModalStateTitle = useCallback(
    (nextState) => () => {
      setOpenTitleState(nextState)
    },
    [],
  )

  const openModalWindow = useCallback(async () => {
    const { data } = await api.post(URL_TITLE_CONTAIN_DEPARTMENT)
    setEntities(data)
    changeModalState(true)()
  }, [api, changeModalState])

  const handleClick = useCallback(async () => {
    await api.post(URL_TITLE_CONTAIN_CREATE, {
      titleId: id,
      partId: selected,
      parentId,
    })
    setSelected(null)
    setChange()
    changeModalState(false)()
  }, [api, id, selected, parentId, setChange, changeModalState])

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
                  className={`flex items-center w-full h-8 ${
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
                    } mr-1.5 color-text-secondary`}
                  />
                  <span className="mr-auto ml-2">{name}</span>
                </NestedButton>
                {isDisplayed && (
                  <div className="flex flex-col  pl-4">
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
            className={`flex items-center w-full h-10 border-b-2 ${
              selected === id ? 'bg-light-gray' : ''
            }`}
            onClick={() => setSelected(id)}
          >
            <span className="mr-auto ml-2">{name}</span>
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
        onClick={openModalWindow}
      >
        Раздел
      </LoadableSecondaryBlueButton>
      <StandardSizeModalWindow
        title="Выбор разделов титула"
        open={open}
        onClose={changeModalState(false)}
      >
        <ScrollBar className="pr-6 font-size-14">{renderedEntities}</ScrollBar>
        <div className="flex ml-auto">
          <Button
            className="ml-2 bg-form-input-color flex items-center w-60 rounded-lg"
            onClick={changeModalState(false)}
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
            setChange={setChange}
            open={openTitle}
            onClose={changeModalStateTitle(false)}
            parentId={parentId}
            closeParent={changeModalState(false)}
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
  setChange: PropTypes.func,
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
}

CreateTitleDepartment.defaultProps = {
  parentId: null,
  className: '',
}

export default CreateTitleDepartment
