import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext } from '@/contants'
import { useParams } from 'react-router-dom'
import Button, { LoadableSecondaryBlueButton } from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import ScrollBar from '@Components/Components/ScrollBar'
import {
  URL_DOCUMENT_APSD_CREATION_OPTIONS,
  URL_TITLE_CONTAIN_CREATE,
} from '@/ApiList'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'

const CreateVolume = ({ className, parentId }) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [open, setOpenState] = useState(false)
  const [entities, setEntities] = useState([])
  const [selected, setSelected] = useState(null)
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const openModalWindow = useCallback(async () => {
    const { data: { children } } = await api.post(URL_DOCUMENT_APSD_CREATION_OPTIONS, {
      classificationName: 'Том',
    })
    setEntities(children)
    changeModalState(true)()
  }, [api, changeModalState])

  const handleClick = useCallback(async () => {
    // await api.post(URL_TITLE_CONTAIN_CREATE, {
    //   titleId: id,
    //   partId: selected,
    //   parentId,
    // })
    setSelected(null)
    changeModalState(false)()
  }, [api, id, selected, parentId, changeModalState])

  const renderEntities = useCallback(
    ({ data: { name, id }, children }) => (
      <WithToggleNavigationItem
        id={id}
        key={id}
        func={(id) => !children.length > 0 && setSelected(id)}
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
                {!!children.length > 0 && (
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
                  {children.map(renderEntities)}
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
        disabled={!parentId}
      >
        Том
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

CreateVolume.propTypes = {}

export default CreateVolume
