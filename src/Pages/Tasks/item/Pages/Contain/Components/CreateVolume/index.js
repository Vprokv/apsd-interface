import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext, DocumentTypeContext } from '@/contants'
import { useParams } from 'react-router-dom'
import Button, { LoadableSecondaryBlueButton } from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import ScrollBar from '@Components/Components/ScrollBar'
import { URL_DOCUMENT_APSD_CREATION_OPTIONS } from '@/ApiList'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import { TabStateManipulation } from '@Components/Logic/Tab'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { NestedButton } from '../../styles'

const CreateVolume = ({
  className,
  parent: { id: parentId, name: parentName },
  setChange,
}) => {
  const documentType = useContext(DocumentTypeContext)
  const {
    tabState: { data: { values: { dss_description } } = {} },
  } = useTabItem({
    stateId: documentType,
  })
  const { openNewTab } = useContext(TabStateManipulation)
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [open, setOpenState] = useState(false)
  const [entities, setEntities] = useState([])
  const [selected, setSelected] = useState({})
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )
  const openModalWindow = useCallback(async () => {
    const {
      data: { children },
    } = await api.post(URL_DOCUMENT_APSD_CREATION_OPTIONS, {
      classificationName: 'Том',
    })
    setEntities(children)
    changeModalState(true)()
  }, [api, changeModalState])

  const handleClick = useCallback(async () => {
    const { id: docTypeId, typeName } = selected
    openNewTab(`/task/new/${docTypeId}/${typeName}`, {
      values: {
        dsid_startup_complex: id,
        dsid_title_structure: parentId,
      },
      valuesCustom: {
        dsid_startup_complex: {
          r_object_id: id,
          dss_description: dss_description,
        },
        dsid_title_structure: {
          r_object_id: parentId,
          dss_name: parentName,
        },
      },
    })
    setChange()
    changeModalState(false)()
    setSelected({})
  }, [
    selected,
    openNewTab,
    id,
    parentId,
    dss_description,
    parentName,
    setChange,
    changeModalState,
  ])

  const renderEntities = useCallback(
    (level = 1) =>
      // eslint-disable-next-line react/prop-types
      ({ data: { name, id }, data, children }) =>
        // eslint-disable-next-line react/prop-types
        children.length > 0 ? (
          <WithToggleNavigationItem id={id} key={id}>
            {({ isDisplayed, toggleDisplayedFlag }) => (
              <div
                className={`flex flex-col w-full   ${isDisplayed ? '' : ''}`}
              >
                <NestedButton
                  level={level}
                  type="button"
                  className="flex items-center w-full h-10 border-b-2 "
                  onClick={toggleDisplayedFlag}
                >
                  <Icon
                    icon={angleIcon}
                    size={10}
                    className={`${
                      isDisplayed ? 'rotate-180' : ''
                    } mt-1 color-text-secondary`}
                  />
                  <span className="mr-auto ml-2">{name}</span>
                </NestedButton>
                {isDisplayed && (
                  <div className="flex flex-col ">
                    {children.map(renderEntities(level + 1))}
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
              selected.id === id ? 'bg-light-gray' : ''
            }`}
            onClick={() => setSelected(data)}
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

CreateVolume.propTypes = {
  className: PropTypes.string,
  parent: PropTypes.object,
}

CreateVolume.defaultProps = {
  className: '',
  parent: {},
}

export default CreateVolume
