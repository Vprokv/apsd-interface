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
  URL_TASK_STATISTIC,
} from '@/ApiList'
import { useParams } from 'react-router-dom'
import { ApiContext, ITEM_TASK, SIDEBAR_STATE } from '@/contants'
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
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
}

const titleName = 'ddt_startup_complex_type_doc'

const Task = () => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const [documentId, setIdDocument] = useState('')
  const [showWindow, setShowWindow] = useState(false)
  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)
  const [message, setMessage] = useState('')
  const getNotification = useOpenNotification()

  const { setTabState } = useTabItem({
    stateId: SIDEBAR_STATE,
  })

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
      // теперь авейтим, чтобы получить корректную статистику
      try {
        await api.post(URL_TASK_MARK_READ, {
          tasksIds: [id],
        })
        // eslint-disable-next-line no-empty
      } catch (e) {
      } finally {
        const {
          data: [data],
        } = await api.post(URL_TASK_STATISTIC)
        setTabState({ stat: data })
      }
    }
    return data
  }, [api, id, setTabState])

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

  const docId = useMemo(() => {
    if (values) {
      return type === titleName ? values.dss_code : values.dss_reg_number
    }

    return 'Документ'
  }, [type, values])

  useSetTabName(useCallback(() => docId, [docId]))

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
            const { status } = await api.post(URL_TASK_COMPLETE, {
              taskId: id,
              signal: name,
            })
            setTabState({ data: await loadData() })
            closeCurrenTab()
            getNotification(customMessagesFuncMap[status]())
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: defaultTaskIcon[name] || DefaultIcon,
      }),
    }),
    [api, closeCurrenTab, getNotification, id],
  )

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
              documentId,
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
            const { data, status } = await api.post(
              URL_INTEGRATION_SEND_LETTER,
              {
                documentId,
              },
            )
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
              {
                documentId,
              },
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
      defaultHandler: ({ name }) => ({
        handler: async () => {
          try {
            const { status } = await api.post(URL_TASK_PROMOTE, {
              id,
              type,
              signal: name,
            })
            getNotification(customMessagesFuncMap[status]())
            // setTabState({ update: true })
            setTabState({ data: await loadData() })
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: DefaultIcon,
      }),
    }),
    [api, documentId, getNotification, id, setTabState, type],
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
      <DocumentIdContext.Provider value={documentId}>
        <Document documentTabs={useDocumentTabs(documentTabs, defaultPages)}>
          <SidebarContainer>
            <Report previousTaskReport={previousTaskReport} />
            <DocumentActions documentActions={actions} />
            <CreatingAdditionalAgreementWindow
              approverId={approverId}
              documentType={type}
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
