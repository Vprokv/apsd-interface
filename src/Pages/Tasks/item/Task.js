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
  URL_DOWNLOAD_FILE,
  URL_INTEGRATION_SEND_LETTER,
  URL_INTEGRATION_TOM_DOWNLOAD,
  URL_TASK_COMPLETE,
  URL_TASK_ITEM,
  URL_TASK_MARK_READ,
  URL_TASK_PROMOTE,
} from '@/ApiList'
import { useParams } from 'react-router-dom'
import {
  ApiContext,
  ITEM_TASK,
  TASK_ITEM_APPROVAL_SHEET,
  TASK_LIST,
} from '@/contants'
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
import { SidebarContainer } from './styles'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import { CurrentTabContext, TabStateManipulation } from '@Components/Logic/Tab'
import UploadDoc from '@/Pages/Tasks/item/Icons/UploadDoc.svg'
import Report from '@/Pages/Tasks/item/Components/Report'
import SaveIcon from '@/Pages/Tasks/item/Icons/SaveIcon.svg'
import CancelIcon from '@/Pages/Tasks/item/Icons/CancelIcon.svg'
import ReCancelIcon from '@/Pages/Tasks/item/Icons/ReCancelIcon.svg'
import DownloadDocument from '@/Pages/Tasks/item/Icons/DownloadDocument.svg'
import { FormWindow } from '@/Components/ModalWindow'
import { SecondaryGreyButton } from '@/Components/Button'
import {
  NOTIFICATION_TYPE_ERROR,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import CreatingAdditionalAgreementWindowWrapper from './Components/CreatingAdditionalAgreementWindow'
import WrapperDocumentActions from './Components/WrapperDocumentActions'
import { LoadTasks } from '@/Pages/Main/constants'
import { updateTabChildrenStates } from '@/Utils/TabStateUpdaters'
import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'
import RejectPrepareWindow from '@/Pages/Tasks/item/Components/RejectPrepareWindow'
import AboutRemarkWindow from '@/Pages/Tasks/item/Components/AboutRemarkWindow'
import downloadFile from '@/Utils/DownloadFile'
import CancelWindow from '@/Pages/Tasks/item/Components/CancelWindow'
import RejectApproveWindow from '@/Pages/Tasks/item/Components/RejectApproveWindow'
import DocumentInfoComponent from '@/Pages/Tasks/item/Components/DocumentInfoComponent'
import ScrollBar from '@Components/Components/ScrollBar'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
}

const titleName = 'ddt_startup_complex_type_doc'

const Task = () => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const [ActionComponent, setActionComponent] = useState(null)
  const closeAction = useCallback(() => setActionComponent(null), [])

  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)
  const [message, setMessage] = useState('')
  const getNotification = useOpenNotification()

  const reloadSidebarTaskCounters = useContext(LoadTasks)

  const closeCurrenTab = useCallback(
    () => onCloseTab(currentTabIndex),
    [onCloseTab, currentTabIndex],
  )

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_TASK_ITEM, {
        taskId: id,
      })
      if (!data.read) {
        // теперь авейтим, чтобы получить корректную статистику
        try {
          await api.post(URL_TASK_MARK_READ, {
            tasksIds: [id],
          })
        } catch (e) {
          const { response: { status } = {} } = e
          getNotification(defaultFunctionsMap[status]())
        } finally {
          reloadSidebarTaskCounters()
        }
      }
      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, getNotification, id, reloadSidebarTaskCounters])

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
        id: documentId,
      } = {},
      data,
    },
    setTabState,
  } = tabItemState

  const docId = useMemo(() => {
    if (values) {
      return type === titleName ? values.dss_code : values.dss_reg_number
    }

    return 'Документ'
  }, [type, values])

  useSetTabName(useCallback(() => docId, [docId]))

  const setComponent = useCallback((Comp) => {
    setActionComponent(Comp)
  }, [])

  useAutoReload(loadData, tabItemState)

  const refValues = useRef()
  useEffect(() => {
    refValues.current = values
  }, [values])

  const updateCurrentTabChildrenStates = updateTabChildrenStates()
  const updateTabStateUpdaterByName = UseTabStateUpdaterByName()

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
            closeCurrenTab()
            getNotification(customMessagesFuncMap[status]())
            setTabState({ loading: false, fetched: false })
            updateCurrentTabChildrenStates([TASK_ITEM_APPROVAL_SHEET], {
              loading: false,
              fetched: false,
            })
            updateTabStateUpdaterByName([TASK_LIST], {
              loading: false,
              fetched: false,
            })
            reloadSidebarTaskCounters()
            // setTabState({ data: await loadData() })
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: defaultTaskIcon[name] || DefaultIcon,
      }),
      reject_consider: {
        handler: () =>
          setComponent({
            Component: (props) => (
              <RejectPrepareWindow signal={'reject_consider'} {...props} />
            ),
          }),
        icon: defaultTaskIcon['reject_consider'],
      },
      apsd_prepare_reject: {
        handler: () =>
          setComponent({
            Component: (props) => (
              <RejectPrepareWindow signal={'apsd_prepare_reject'} {...props} />
            ),
          }),
        icon: defaultTaskIcon['apsd_prepare_reject'],
      },
      reject_prepare: {
        handler: () =>
          setComponent({
            Component: (props) => (
              <RejectPrepareWindow signal={'reject_prepare'} {...props} />
            ),
          }),
        icon: defaultTaskIcon['reject_prepare'],
      },
      finish_simple_approve: {
        handler: async () => {
          try {
            const { status } = await api.post(URL_TASK_COMPLETE, {
              taskId: id,
              signal: 'finish_simple_approve',
            })
            closeCurrenTab()
            getNotification(customMessagesFuncMap[status]())
            setTabState({ loading: false, fetched: false })
            updateCurrentTabChildrenStates([TASK_ITEM_APPROVAL_SHEET], {
              loading: false,
              fetched: false,
            })
            updateTabStateUpdaterByName([TASK_LIST], {
              loading: false,
              fetched: false,
            })
            reloadSidebarTaskCounters()
            // setTabState({ data: await loadData() })
          } catch (e) {
            const { response: { status, data } = {} } = e
            if (status === 412 && data === 'finish_without_remarks') {
              return setComponent({
                Component: (props) => (
                  <AboutRemarkWindow
                    signal={'finish_without_remark'}
                    {...props}
                  />
                ),
              })
            }
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: defaultTaskIcon['finish_simple_approve'] || DefaultIcon,
      },
      reject_approve: {
        handler: () => setComponent({ Component: RejectApproveWindow }),
        icon: defaultTaskIcon['reject_approve'],
      },
    }),
    [
      api,
      closeCurrenTab,
      getNotification,
      id,
      reloadSidebarTaskCounters,
      setComponent,
      setTabState,
      updateCurrentTabChildrenStates,
      updateTabStateUpdaterByName,
    ],
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
              id: documentId,
            })
            getNotification(customMessagesFuncMap[status]())
            setTabState({ loading: false, fetched: false })
            updateCurrentTabChildrenStates([TASK_ITEM_APPROVAL_SHEET], {
              loading: false,
              fetched: false,
            })
            reloadSidebarTaskCounters()
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
            setTabState({ loading: false, fetched: false })
            updateCurrentTabChildrenStates([TASK_ITEM_APPROVAL_SHEET], {
              loading: false,
              fetched: false,
            })
            reloadSidebarTaskCounters()
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
            setTabState({ loading: false, fetched: false })
            updateCurrentTabChildrenStates([TASK_ITEM_APPROVAL_SHEET], {
              loading: false,
              fetched: false,
            })
            reloadSidebarTaskCounters()
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
      download_template_letter: {
        handler: async () => {
          try {
            const { data, status } = await api.post(
              URL_INTEGRATION_TOM_DOWNLOAD,
              {
                documentId,
              },
            )

            const fileData = await api.post(
              URL_DOWNLOAD_FILE,
              {
                type: data.tableName,
                column: 'dsc_content',
                id: data.filekey,
              },
              { responseType: 'blob' },
            )

            if (fileData.data instanceof Error) {
              getNotification({
                type: NOTIFICATION_TYPE_ERROR,
                message: `${data.filekey} документ не найден`,
              })
            } else {
              downloadFile(fileData)
            }
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: DownloadDocument,
      },
      additional_agreement: {
        icon: UploadDoc,
        caption: 'Создание доп. согласования',
        handler: () =>
          setComponent({ Component: CreatingAdditionalAgreementWindowWrapper }),
      },
      apsd_reject_cancel: {
        handler: async () => {
          try {
            const { status } = await api.post(URL_BUSINESS_DOCUMENT_RECALL, {
              documentId,
              documentType: type,
              signal: 'apsd_reject_cancel',
            })
            getNotification(customMessagesFuncMap[status]())
            setTabState({ loading: false, fetched: false })
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: ReCancelIcon,
      },
      apsd_cancel: {
        handler: () =>
          setComponent({
            Component: (props) => (
              <CancelWindow
                signal={'apsd_cancel'}
                documentType={type}
                {...props}
              />
            ),
          }),
        icon: CancelIcon,
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
            setTabState({ loading: false, fetched: false })
            updateCurrentTabChildrenStates([TASK_ITEM_APPROVAL_SHEET], {
              loading: false,
              fetched: false,
            })
            reloadSidebarTaskCounters()
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: defaultTaskIcon[name] || DefaultIcon,
      }),
    }),
    [
      api,
      documentId,
      getNotification,
      id,
      reloadSidebarTaskCounters,
      setComponent,
      setTabState,
      type,
      updateCurrentTabChildrenStates,
    ],
  )

  const wrappedTaskActions = useDocumentActions(taskActions, TaskHandlers)

  const wrappedDocumentActions = useDocumentActions(documentActions, {
    ...defaultDocumentHandlers,
    ...documentHandlers,
  })

  const closeModalWindow = useCallback(() => setMessage(''), [])
  return (
    <DocumentTypeContext.Provider value={ITEM_TASK}>
      <DocumentIdContext.Provider value={documentId}>
        <Document documentTabs={useDocumentTabs(documentTabs, defaultPages)}>
          <SidebarContainer>
            <ScrollBar>
              {data && <DocumentInfoComponent {...data} />}
              <Report previousTaskReport={previousTaskReport} />
              <WrapperDocumentActions documentActions={wrappedTaskActions} />
              <WrapperDocumentActions
                documentActions={wrappedDocumentActions}
              />
            </ScrollBar>
          </SidebarContainer>
        </Document>
        {ActionComponent && (
          <ActionComponent.Component
            open={true}
            documentId={documentId}
            onClose={closeAction}
            loadData={loadData}
            stateId={ITEM_TASK}
          />
        )}
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
