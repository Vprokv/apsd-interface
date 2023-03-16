import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Layout from './Components/Layout'
import {
  URL_BASKET_ADD,
  URL_BUSINESS_DOCUMENT_RECALL,
  URL_CONTENT_SEND_EEHD,
  URL_DOCUMENT_ITEM,
  URL_DOCUMENT_UPDATE,
  URL_INTEGRATION_SEND_LETTER,
  URL_TASK_PROMOTE,
} from '@/ApiList'
import { useParams } from 'react-router-dom'
import { ApiContext, ITEM_DOCUMENT, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useTabItem from '@Components/Logic/Tab/TabItem'
import useDocumentTabs from './Hooks/useDocumentTabs'
import {
  defaultDocumentHandlers,
  defaultPages,
  DocumentIdContext,
  DocumentTypeContext,
} from './constants'
import DefaultIcon from './Icons/DefaultIcon.svg'
import DeleteIcon from './Icons/DeleteIcon.svg'
import SendASUD from './Icons/SendASUD.svg'
import SaveIcon from './Icons/SaveIcon.svg'
import useDocumentActions from './Hooks/useDocumentActions'
import DocumentActions from '@/Pages/Tasks/item/Components/DocumentActions'
import { SidebarContainer } from './styles'
import { FormWindow } from '@/Components/ModalWindow'
import { SecondaryGreyButton } from '@/Components/Button'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import UseTabStateUpdaterByName from '@/Utils/UseTabStateUpdaterByName'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Документ изменен',
    }
  },
}

const titleName = 'ddt_startup_complex_type_doc'

const Document = () => {
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
  const getNotification = useOpenNotification()

  const tabItemState = useTabItem({
    stateId: ITEM_DOCUMENT,
  })
  const {
    tabState: { data: { documentActions, documentTabs, values } = {} },
  } = tabItemState

  const documentId = useMemo(() => {
    let v
    if (values) {
      v = type === titleName ? values.dss_code : values.dss_reg_number
    }

    return v || 'Документ'
  }, [type, values])

  const remoteTabUpdater = UseTabStateUpdaterByName([ITEM_DOCUMENT])
  const remoteApprovalUpdater = UseTabStateUpdaterByName([
    TASK_ITEM_APPROVAL_SHEET,
  ])

  useSetTabName(useCallback(() => documentId, [documentId]))
  const refValues = useRef()
  useEffect(() => {
    refValues.current = values
  }, [values])

  useAutoReload(loadData, tabItemState)
  const documentHandlers = useMemo(
    () => ({
      ...defaultDocumentHandlers,
      save: {
        handler: async () => {
          try {
            const { status } = await api.post(URL_DOCUMENT_UPDATE, {
              values: refValues.current,
              type,
              id,
            })
            getNotification(customMessagesFuncMap[status]())
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: SaveIcon,
      },
      send_to_eehd: {
        handler: async () => {
          try {
            const { status } = await api.post(URL_CONTENT_SEND_EEHD, {
              documentId: id,
            })
            getNotification(customMessagesFuncMap[status]())
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: DefaultIcon,
      },
      send_letter: {
        handler: async () => {
          try {
            const { data } = await api.post(URL_INTEGRATION_SEND_LETTER, {
              documentId: id,
            })
            setMessage(data)
            getNotification(customMessagesFuncMap[status]())
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: SendASUD,
      },
      apsd_canceled: {
        handler: async () => {
          try {
            const { data, status } = await api.post(
              URL_BUSINESS_DOCUMENT_RECALL,
              { documentId: id },
            )
            setMessage(data)
            getNotification(customMessagesFuncMap[status]())
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: DefaultIcon,
      },
      delete: {
        handler: async () => {
          try {
            const { data, status } = await api.post(URL_BASKET_ADD, {
              documentIds: [id],
            })
            setMessage(data)
            remoteTabUpdater({ loading: false, fetched: false })
            remoteApprovalUpdater({ loading: false, fetched: false })
            getNotification(customMessagesFuncMap[status]())
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: DefaultIcon,
      },
      defaultHandler: ({ name }) => ({
        handler: async () => {
          try {
            const { status } = await api.post(URL_TASK_PROMOTE, {
              id,
              type,
              signal: name,
            })
            getNotification(customMessagesFuncMap[status]())
            remoteTabUpdater({ loading: false, fetched: false })
            remoteApprovalUpdater({ loading: false, fetched: false })
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: DeleteIcon,
      }),
    }),
    [api, getNotification, id, remoteApprovalUpdater, remoteTabUpdater, type],
  )

  const wrappedDocumentActions = useDocumentActions(
    documentActions,
    documentHandlers,
  )

  const closeModalWindow = useCallback(() => setMessage(''), [])

  return (
    <DocumentTypeContext.Provider value={ITEM_DOCUMENT}>
      <DocumentIdContext.Provider value={id}>
        <Layout documentTabs={useDocumentTabs(documentTabs, defaultPages)}>
          <SidebarContainer>
            <DocumentActions documentActions={wrappedDocumentActions} />
          </SidebarContainer>
        </Layout>
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
      </DocumentIdContext.Provider>
    </DocumentTypeContext.Provider>
  )
}

export default Document
