import PropTypes from 'prop-types'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { LoadableSecondaryBlueButton } from '@/Components/Button'
import ScrollBar from '@Components/Components/ScrollBar'
import Icon from '@Components/Components/Icon'
import { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext } from '@/contants'
import { URL_TITLE_CONTAIN_DEPARTMENT } from '@/ApiList'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'

const CreateTitleDepartment = ({ className }) => {
  const api = useContext(ApiContext)
  const [open, setOpenState] = useState(false)
  const [entities, setEntities] = useState([])
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const openModalWindow = useCallback(async () => {
    const { data } = await api.post(URL_TITLE_CONTAIN_DEPARTMENT)
    setEntities(data)
    changeModalState(true)()
  }, [api, changeModalState])

  const renderEntities = useCallback(
    ({ id, name, code, sections }) => (
      <WithToggleNavigationItem id={id} key={id}>
        {({ isDisplayed, toggleDisplayedFlag }) => (
          <div className={`flex flex-col w-full ${isDisplayed ? '' : 'mb-4'}`}>
            <button
              type="button"
              className="flex items-start w-full"
              onClick={toggleDisplayedFlag}
            >
              <span className="mr-auto">{name}</span>
              <Icon
                icon={angleIcon}
                size={10}
                className={`${isDisplayed ? '' : 'rotate-180'} mt-1`}
              />
            </button>
            {isDisplayed && (
              <div className="flex flex-col mt-4 pl-4">
                {sections.map(renderEntities)}
              </div>
            )}
          </div>
        )}
      </WithToggleNavigationItem>
    ),
    [],
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
      </StandardSizeModalWindow>
    </>
  )
}

CreateTitleDepartment.propTypes = {}

export default CreateTitleDepartment
