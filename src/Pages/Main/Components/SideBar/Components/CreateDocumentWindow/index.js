import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext } from '@/contants'
import ScrollBar from '@Components/Components/ScrollBar'
import Icon from '@Components/Components/Icon'
import { URL_DOCUMENT_CREATION_OPTIONS } from '@/ApiList'
import {
  DocumentIcon,
  DocumentTypesContainer,
  SmallSizeModalWindow,
} from './style'
import RadioButton from '@/Components/Inputs/RadioButton'
import Button from '@/Components/Button'
import WithToggleNavigationItem from '../withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import NavigationDocumentIcon from '../../icons/NavigationDocumentIcon'
import { useNavigate } from 'react-router-dom'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'

const FirstLevelHeaderComponent = ({ children, selected }) => (
  <div className="flex items-start font-size-14 w-full">
    <DocumentIcon icon={NavigationDocumentIcon} size={22} selected={selected} />
    <div className="mt-0.5 w-full">{children}</div>
  </div>
)

const DefaultHeaderComponent = ({ children }) => (
  <div className="font-size-12">{children}</div>
)

const CreateDocumentWindow = ({ onClose }) => {
  const api = useContext(ApiContext)
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState({})
  const [newDocumentData, setNewDocumentData] = useState({})

  useEffect(() => {
    ;(async () => {
      const {
        data: { children },
      } = await api.post(URL_DOCUMENT_CREATION_OPTIONS)
      setDocuments(children)
    })()
  }, [api])

  useEffect(() => {
    selectedDocument.id &&
      (async () => {
        try {
          const { data } = await api.post(
            `/sedo/classification/${selectedDocument.id}/template`,
          )
          if (data) {
            setNewDocumentData(data)
          } else {
            setNewDocumentData({})
          }
        } catch (_) {
          setNewDocumentData({})
        }
      })()
  }, [api, selectedDocument])

  const toNewItem = useCallback(() => {
    selectedDocument &&
      navigate(`/task/new/${selectedDocument.id}/${selectedDocument.typeName}`)
    onClose()
  }, [navigate, onClose, selectedDocument])

  const handleSelectDocument = useCallback(
    (obj) => () => setSelectedDocument(obj),
    [],
  )

  const renderAttributes = useMemo(() => {
    const templates =
      (!!newDocumentData?.attrTemplate &&
        Object.values(newDocumentData?.attrTemplate)) ||
      []

    return (
      <div className="flex flex-wrap">
        {templates.map(({ label, value }) => (
          <text
            key={value}
            className="font-size-14 bg-light-gray rounded-md p-2 ml-2 mb-2"
          >
            {`${label} = ${value}`}
          </text>
        ))}
      </div>
    )
  }, [newDocumentData])

  const renderDocumentItem = useCallback(
    (HeaderComponent) =>
      ({ data, data: { name, id, typeName }, children }) => {
        const selected = selectedDocument.name === name
        return children.length > 0 ? (
          <WithToggleNavigationItem id={id} key={id}>
            {({ isDisplayed, toggleDisplayedFlag }) => (
              <HeaderComponent key={id}>
                <div
                  className={`flex flex-col w-full ${
                    isDisplayed ? '' : 'mb-4'
                  }`}
                >
                  <button
                    type="button"
                    className="flex items-start w-full"
                    onClick={() => {
                      typeName && handleSelectDocument(data)()
                      toggleDisplayedFlag()
                    }}
                  >
                    <span
                      className={selected ? 'color-blue-1 mr-auto' : 'mr-auto'}
                    >
                      {name}
                    </span>
                    <Icon
                      icon={angleIcon}
                      size={10}
                      className={`${isDisplayed ? '' : 'rotate-180'} mt-1`}
                    />
                  </button>
                  {isDisplayed && (
                    <div className="flex flex-col mt-4 pl-4">
                      {children.map(renderDocumentItem(DefaultHeaderComponent))}
                    </div>
                  )}
                </div>
              </HeaderComponent>
            )}
          </WithToggleNavigationItem>
        ) : (
          <HeaderComponent selected={selected} key={id}>
            <button
              type="button"
              className="mb-4 text-left"
              onClick={handleSelectDocument(data)}
            >
              <span className={selected ? 'color-blue-1' : ''}>{name}</span>
            </button>
          </HeaderComponent>
        )
      },
    [selectedDocument, handleSelectDocument],
  )

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex overflow-hidden mb-6 h-full">
        {/*<DocumentTypesContainer className="flex flex-col h-full flex-0">*/}
        <ScrollBar className="pr-6 w-full px-2">
          {documents.map(renderDocumentItem(FirstLevelHeaderComponent))}
        </ScrollBar>
        {/*</DocumentTypesContainer>*/}
        {/*<div className="pl-6 w-full h-full">*/}
        {/*  <h2 className="font-medium text-2xl color-blue-1 mb-4">*/}
        {/*    {selectedDocument.name}*/}
        {/*  </h2>*/}
        {/* <div className="separator rounded-md mb-6">*/}
        {/*  <h3 className="bg-light-gray px-4 py-3 font-medium font-size-14 ">*/}
        {/*    Контент*/}
        {/*  </h3>*/}
        {/*  <div className="p-4">*/}
        {/*    <RadioButton label="использовать шаблон контента" />*/}
        {/*    <RadioButton label="не использовать шаблон контента" />*/}
        {/*  </div>*/}
        {/* </div>*/}
        {/* <div className="separator rounded-md mb-6">*/}
        {/*  <h3 className="bg-light-gray px-4 py-3 font-medium font-size-14 ">*/}
        {/*    Атрибуты*/}
        {/*  </h3>*/}
        {/*  <div className="p-4">{renderAttributes}</div>*/}
        {/* </div>*/}
        {/*</div>*/}
      </div>
      <div className="flex w-full items-center justify-end">
        <Button
          className="bg-light-gray flex items-center w-60 rounded-lg mr-4 justify-center"
          onClick={onClose}
        >
          Закрыть
        </Button>
        <Button
          className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center"
          onClick={toNewItem}
        >
          Создать
        </Button>
      </div>
    </div>
  )
}

CreateDocumentWindow.propTypes = {
  onClose: PropTypes.func,
}

const CrateDocumentWrapper = (props) => (
  <SmallSizeModalWindow {...props} title="Создание нового документа">
    <CreateDocumentWindow {...props} />
  </SmallSizeModalWindow>
)

export default CrateDocumentWrapper
