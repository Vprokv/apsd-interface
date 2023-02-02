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
  DocumentIdContext,
  DocumentTypeContext,
} from './constants'
import DefaultIcon from './Icons/DefaultIcon.svg'
import SendASUD from './Icons/SendASUD.svg'
import SaveIcon from './Icons/SaveIcon.svg'
import useDocumentActions from './Hooks/useDocumentActions'
import DocumentActions from '@/Pages/Tasks/item/Components/DocumentActions'
import { SidebarContainer } from './styles'
import { FormWindow } from '@/Components/ModalWindow'
import { SecondaryGreyButton } from '@/Components/Button'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import {
  defaultMessageMap,
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_INFO,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'

const customMessagesMap = {
  ...defaultMessageMap,
  200: {
    type: NOTIFICATION_TYPE_SUCCESS,
    message: 'Документ изменен',
  },
  201: {
    type: NOTIFICATION_TYPE_SUCCESS,
    message: 'Запрос отправлен',
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
    tabState: {
      data: {
        documentActions,
        documentTabs,
        values,
        values: { dss_work_number = 'Документ' } = {},
      } = {},
    },
    setTabState,
  } = tabItemState

  const documentId = useMemo(() => {
    let v
    if (values) {
      v = type === titleName ? values.dss_code : values.dss_reg_number
    }

    return v || 'Документ'
  }, [type, values])

  useSetTabName(useCallback(() => documentId, [documentId]))
  const refValues = useRef()
  useEffect(() => {
    refValues.current = values
  }, [values])

  useAutoReload(loadData, tabItemState)
  // todo добавить getNotification для всех
  const documentHandlers = useMemo(
    () => ({
      ...defaultDocumentHandlers,
      save: {
        handler: async () => {
          try {
            const response = await api.post(URL_DOCUMENT_UPDATE, {
              values: refValues.current,
              type,
              id,
            })
            getNotification(customMessagesMap[response.status])
          } catch (e) {
            const { response: { status } = {} } = e
            getNotification(customMessagesMap[status])
          }
        },
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
        icon: SendASUD,
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
        handler: async () => {
          try {
            const response = await api.post(URL_TASK_PROMOTE, {
              id,
              type,
              signal: name,
            })
            getNotification(
              customMessagesMap[response?.status === 200 ? 201 : ''],
            )
            setTabState({ update: true })
          } catch (e) {
            const { response: { status } = {} } = e
            getNotification(customMessagesMap[status])
          }
        },
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
