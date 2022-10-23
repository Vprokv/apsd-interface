import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import Button, { LoadableSecondaryBlueButton } from '@/Components/Button'
import ScrollBar from '@Components/Components/ScrollBar'
import Icon from '@Components/Components/Icon'
import { ApiContext } from '@/contants'
import {
  URL_TITLE_CONTAIN_CREATE,
  URL_TITLE_CONTAIN_DEPARTMENT,
  URL_TITLE_CONTAIN_SAVE,
} from '@/ApiList'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import NewTitle from '@/Pages/Tasks/item/Pages/Contain/Components/CreateTitleDepartment/Components/NewTitle'
import { useParams } from 'react-router-dom'

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
    ({ id, name, code, sections }) => (
      <WithToggleNavigationItem
        id={id}
        key={id}
        func={(id) => !sections.length > 0 && setSelected(id)}
      >
        {({ isDisplayed, toggleDisplayedFlag }) => (
          <div
            className={`flex flex-col w-full   ${isDisplayed ? '' : ''} ${
              selected === id ? 'bg-light-gray' : ''
            }`}
          >
            <div className="pl-4">
              <button
                type="button"
                className="flex items-center w-full h-10 border-b-2 "
                onClick={toggleDisplayedFlag}
              >
                {!!sections.length > 0 && (
                  <Icon
                    icon={angleIcon}
                    size={10}
                    className={`${
                      isDisplayed ? 'rotate-180' : ''
                    } mt-1 color-text-secondary`}
                  />
                )}
                <span className="mr-auto ml-2">{name}</span>
              </button>
              {isDisplayed && (
                <div className="flex flex-col ">
                  {sections.map(renderEntities)}
                </div>
              )}
            </div>
          </div>
        )}
      </WithToggleNavigationItem>
    ),
    [selected],
  )

  const renderedEntities = useMemo(
    () => entities.map(renderEntities),
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
        <div className="flex items-center justify-end">
          <Button
            className="bg-light-gray flex items-center w-60 rounded-lg mr-4 font-weight-normal justify-center"
            onClick={changeModalState(false)}
          >
            Отменить
          </Button>
          <Button
            className="text-white bg-blue-1 flex items-center w-60 mr-4 rounded-lg justify-center font-weight-normal"
            onClick={changeModalStateTitle(true)}
          >
            Создать новый
          </Button>
          <NewTitle
            setChange={setChange}
            open={openTitle}
            onClose={changeModalStateTitle(false)}
            parentId={selected}
            closeParent={changeModalState(false)}
          />
          <Button
            className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center font-weight-normal"
            onClick={handleClick}
          >
            Выбрать
          </Button>
        </div>
      </StandardSizeModalWindow>
    </>
  )
}

CreateTitleDepartment.defaultProps = {
  parentId: null,
}

CreateTitleDepartment.propTypes = {
  className: PropTypes.string,
  setChange: PropTypes.func,
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
}

export default CreateTitleDepartment
