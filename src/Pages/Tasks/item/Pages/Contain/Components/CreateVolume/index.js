import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext, TASK_ITEM_STRUCTURE } from '@/contants'
import { useParams } from 'react-router-dom'
import Button from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import ScrollBar from '@Components/Components/ScrollBar'
import { URL_DOCUMENT_APSD_CREATION_OPTIONS } from '@/ApiList'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import { TabStateManipulation } from '@Components/Logic/Tab'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { NestedButton } from '../../styles'
import { DocumentTypeContext } from '../../../../constants'
import useReadDataState from '@Components/Logic/Tab/useReadDataState'

const CreateVolume = ({ addVolumeState }) => {
  const documentType = useContext(DocumentTypeContext)
  const [tabState, setTabState] = useTabItem({
    stateId: documentType,
  })
  const [{ data = {} }] = useReadDataState(tabState, setTabState)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [open, setOpenState] = useState(false)
  const [entities, setEntities] = useState([])
  const [selected, setSelected] = useState({})

  const handleCancel = useCallback(() => {
    if (addVolumeState.onCancel) {
      addVolumeState.onCancel()
    }
    setOpenState(false)
  }, [addVolumeState])

  const handleClose = useCallback(
    (data) => {
      if (addVolumeState.onCreate) {
        addVolumeState.onCreate(data)
      }
      setOpenState(false)
    },
    [addVolumeState],
  )

  const openModalWindow = useCallback(async () => {
    const {
      data: { children },
    } = await api.post(URL_DOCUMENT_APSD_CREATION_OPTIONS, {
      classificationName: 'Том',
    })
    setEntities(children)
    setOpenState(true)
  }, [api])

  useEffect(() => {
    if (addVolumeState.row) {
      openModalWindow()
    }
  }, [addVolumeState, openModalWindow])

  const handleClick = useCallback(async () => {
    const { row: { id: parentId, name: parentName } = {} } = addVolumeState
    const { id: docTypeId, typeName } = selected
    openTabOrCreateNewTab(`/task/new/${docTypeId}/${typeName}`, {
      parentTabName: [TASK_ITEM_STRUCTURE],
      values: {
        dsid_startup_complex: id,
        dsid_title_structure: parentId,
      },
      valuesCustom: {
        dsid_startup_complex: data,
        dsid_title_structure: {
          r_object_id: parentId,
          dss_name: parentName,
        },
      },
    })
    handleClose()
    setSelected({})
  }, [addVolumeState, selected, openTabOrCreateNewTab, id, data, handleClose])

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
    <StandardSizeModalWindow
      title="Выбор разделов титула"
      open={open}
      onClose={handleCancel}
    >
      <ScrollBar className="pr-6 font-size-14">{renderedEntities}</ScrollBar>
      <div className="flex items-center justify-end">
        <Button
          className="font-size-12 bg-light-gray flex items-center w-60 rounded-lg mr-4 font-weight-normal justify-center"
          onClick={handleCancel}
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
  )
}

CreateVolume.propTypes = {
  addVolumeState: PropTypes.shape({
    onCreate: PropTypes.func,
    onCancel: PropTypes.func,
    row: PropTypes.object,
  }),
}

CreateVolume.defaultProps = {
  addVolumeState: {},
}

export default CreateVolume
