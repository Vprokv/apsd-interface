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
  URL_DOCUMENT_UPDATE,
  URL_INTEGRATION_SEND_LETTER,
  URL_TASK_COMPLETE,
  URL_TASK_ITEM,
  URL_TASK_MARK_READ,
  URL_TASK_PROMOTE,
} from '@/ApiList'
import { useParams } from 'react-router-dom'
import { ApiContext, ITEM_TASK } from '@/contants'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useTabItem from '@Components/Logic/Tab/TabItem'
import useDocumentTabs from './Hooks/useDocumentTabs'
import {
  defaultDocumentHandlers,
  defaultPages,
  defaultTaskIcon,
  DocumentIdContext,
  DocumentTypeContext,
} from './constants'
import DefaultIcon from './Icons/DefaultIcon.svg'
import SendASUD from './Icons/SendASUD.svg'
import useDocumentActions from './Hooks/useDocumentActions'
import DocumentActions from '@/Pages/Tasks/item/Components/DocumentActions'
import { SidebarContainer } from './styles'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import PrintIcon from './Icons/PrintIcon.svg'
import CreatingAdditionalAgreementWindow from './Components/CreatingAdditionalAgreementWindow'
import { CurrentTabContext, TabStateManipulation } from '@Components/Logic/Tab'
import UploadDoc from '@/Pages/Tasks/item/Icons/UploadDoc.svg'
import Report from '@/Pages/Tasks/item/Components/Report'
import SaveIcon from '@/Pages/Tasks/item/Icons/SaveIcon.svg'
import { FormWindow } from '@/Components/ModalWindow'
import { SecondaryGreyButton } from '@/Components/Button'
import {
  defaultMessageMap,
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_INFO,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'

const customMessagesMap = {
  ...defaultMessageMap,
  412: {
    type: NOTIFICATION_TYPE_ERROR,
    message: 'На этом этапе требуется отправка письма',
  },
}

const Task = () => {
  const { id, type } = useParams()
  const documentId = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [idDocument, setIdDocument] = useState('')
  const [showWindow, setShowWindow] = useState(false)
  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)
  const [message, setMessage] = useState('')
  const getNotification = useOpenNotification()

  const closeCurrenTab = useCallback(
    () => onCloseTab(currentTabIndex),
    [onCloseTab, currentTabIndex],
  )

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_TASK_ITEM, {
      taskId: id,
    })
    setIdDocument(data?.id)
    if (!data.read) {
      // не ждем запроса, он выполняеться фоном.
      api.post(URL_TASK_MARK_READ, {
        tasksIds: [id],
      })
    }
    return data
  }, [api, id])

  const tabItemState = useTabItem({
    stateId: ITEM_TASK,
  })
  const {
    tabState: {
      data: {
        previousTaskReport,
        documentActions,
        taskActions,
        documentTabs,
        values,
        values: { dss_work_number = 'Документ' } = {},
        approverId,
      } = {},
    },
  } = tabItemState

  useSetTabName(useCallback(() => dss_work_number, [dss_work_number]))

  useAutoReload(loadData, tabItemState)

  const closeWindow = useCallback(() => {
    setShowWindow(false)
  }, [])

  const refValues = useRef()
  useEffect(() => {
    refValues.current = values
  }, [values])

  const TaskHandlers = useMemo(
    () => ({
      defaultHandler: ({ caption, name }) => ({
        key: name,
        caption,
        handler: async () => {
          try {
            await api.post(URL_TASK_COMPLETE, {
              taskId: id,
              signal: name,
            })
            closeCurrenTab()
          } catch (e) {
            const { response: { status } = {} } = e
            getNotification(customMessagesMap[status])
          }
        },
        icon: defaultTaskIcon[name] || DefaultIcon,
      }),
    }),
    [api, closeCurrenTab, id],
  )

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
            documentId,
          }),
        icon: DefaultIcon,
      },
      send_letter: {
        handler: async () => {
          const { data } = await api.post(URL_INTEGRATION_SEND_LETTER, {
            documentId,
          })
          setMessage(data)
        },
        icon: SendASUD,
      },
      apsd_canceled: {
        handler: async () => {
          const { data } = await api.post(URL_BUSINESS_DOCUMENT_RECALL, {
            documentId,
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
    [api, documentId, id, type],
  )

  const wrappedTaskActions = useDocumentActions(taskActions, TaskHandlers)

  const wrappedDocumentActions = useDocumentActions(documentActions, {
    ...defaultDocumentHandlers,
    ...documentHandlers,
    ...{
      additional_agreement: {
        icon: UploadDoc,
        caption: 'Создание доп. согласования',
        handler: () => setShowWindow(true),
      },
    },
  })

  const actions = useMemo(
    () => [...wrappedTaskActions, ...wrappedDocumentActions],
    [wrappedDocumentActions, wrappedTaskActions],
  )

  const closeModalWindow = useCallback(() => setMessage(''), [])

  return (
    <DocumentTypeContext.Provider value={ITEM_TASK}>
      <DocumentIdContext.Provider value={idDocument}>
        <Document documentTabs={useDocumentTabs(documentTabs, defaultPages)}>
          <SidebarContainer>
            <Report previousTaskReport={previousTaskReport} />
            <DocumentActions documentActions={actions} />
            <CreatingAdditionalAgreementWindow
              approverId={approverId}
              open={showWindow}
              onClose={closeWindow}
              closeCurrenTab={closeCurrenTab}
            />
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
      </DocumentIdContext.Provider>
    </DocumentTypeContext.Provider>
  )
}

export default Task
