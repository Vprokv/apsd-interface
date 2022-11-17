import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Document from './Components/Layout'
import {
  URL_BUSINESS_DOCUMENT_RECALL,
  URL_CONTENT_SEND_EEHD,
  URL_DOCUMENT_ITEM,
  URL_DOCUMENT_UPDATE,
  URL_INTEGRATION_SEND_LETTER,
  URL_TASK_PROMOTE,
} from '@/ApiList'
import { useParams } from 'react-router-dom'
import { ApiContext, ITEM_DOCUMENT } from '@/contants'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useTabItem from '@Components/Logic/Tab/TabItem'
import useDocumentTabs from './Hooks/useDocumentTabs'
import {
  defaultDocumentHandlers,
  defaultPages,
  DocumentTypeContext,
} from './constants'
import DefaultIcon from './icons/DefaultIcon.svg'
import SaveIcon from './icons/SaveIcon.svg'
import useDocumentActions from './Hooks/useDocumentActions'
import DocumentActions from '@/Pages/Tasks/item/Components/DocumentActions'
import { SidebarContainer } from './styles'
import { FormWindow } from '@/Components/ModalWindow'
import { SecondaryGreyButton } from '@/Components/Button'

const Task = () => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const [message, setMessage] = useState('')
  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_DOCUMENT_ITEM, {
      id,
      type,
    })
    return data
  }, [api, id, type])

  const {
    tabState: { data: { values: { dss_work_number = 'Документ' } = {} } = {} },
  } = useTabItem({ stateId: ITEM_DOCUMENT })

  const tabItemState = useTabItem({
    setTabName: useCallback(() => dss_work_number, [dss_work_number]),
    stateId: ITEM_DOCUMENT,
  })
  const {
    tabState: { data: { documentActions, documentTabs, values } = {} },
  } = tabItemState
  const refValues = useRef()
  useEffect(() => {
    refValues.current = values
  }, [values])

  useAutoReload(loadData, tabItemState)

  const documentHandlers = useMemo(
    () => ({
      ...defaultDocumentHandlers,
      save: {
        handler: () =>
          api.post(URL_DOCUMENT_UPDATE, {
            values: refValues.current,
            type,
            id,
          }),
        icon: SaveIcon,
      },
      send_to_eehd: {
        handler: () =>
          api.post(URL_CONTENT_SEND_EEHD, {
            documentId: id,
          }),
        icon: DefaultIcon,
      },
      send_letter: {
        handler: async () => {
          const { data } = await api.post(URL_INTEGRATION_SEND_LETTER, {
            documentId: id,
          })
          setMessage(data)
        },
        icon: DefaultIcon,
      },
      apsd_canceled: {
        handler: async () => {
          const { data } = await api.post(URL_BUSINESS_DOCUMENT_RECALL, {
            documentId: id,
          })
          setMessage(data)
        },
        icon: DefaultIcon,
      },
      defaultHandler: ({ name }) => ({
        handler: () =>
          api.post(URL_TASK_PROMOTE, {
            id,
            type,
            signal: name,
          }),
        icon: DefaultIcon,
      }),
    }),
    [api, id, type],
  )

  const wrappedDocumentActions = useDocumentActions(
    documentActions,
    documentHandlers,
  )

  const closeModalWindow = useCallback(() => setMessage(''), [])

  return (
    <DocumentTypeContext.Provider value={ITEM_DOCUMENT}>
      <Document documentTabs={useDocumentTabs(documentTabs, defaultPages)}>
        <SidebarContainer>
          <DocumentActions documentActions={wrappedDocumentActions} />
        </SidebarContainer>
      </Document>
      <FormWindow open={message} onClose={closeModalWindow}>
        <div className="text-center mt-4 mb-12">{message}</div>
        <SecondaryGreyButton
          type="button"
          className="w-40 m-auto"
          onClick={closeModalWindow}
        >
          Закрыть
        </SecondaryGreyButton>
      </FormWindow>
    </DocumentTypeContext.Provider>
  )
}

export default Task
