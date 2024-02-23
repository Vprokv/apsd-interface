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
  URL_REMARK_LIST,
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
  defaultPages,
  defaultTaskIcon,
  DocumentIdContext,
  DocumentTypeContext,
} from './constants'
import DefaultIcon from './Icons/DefaultIcon.svg'
import SendASUD from './Icons/SendASUD.svg'
import useDocumentActions from './Hooks/useDocumentActions'
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
import SideBar from '@/Pages/Tasks/item/Components/SideBar'
import RejectSapPrepareWindow from './Components/RejectSapPrepareWindow'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import PrintCardWindow from '@/Pages/Tasks/item/Components/PrintCardWindow'
import ChangeStageWindow from '@/Pages/Tasks/item/Components/ChangeStageWindow'
import useReadCurrentChildrenTabContext from '@/Pages/Tasks/item/DocumentHandlers/hooks/useReadCurrentChildrenTabContext'
import { filterManipulationData } from '@/Pages/Tasks/item/DocumentHandlers/Handlers/FinishSimpleApprove'
import ViewAdditionsRemarks from '@/Pages/Tasks/item/Components/ViewAdditionaRemarks'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
}

const titleName = 'ddt_startup_complex_type_doc'
const tomeName = 'ddt_project_calc_type_doc'

const Task = () => {
  const { id, type, ['*']: childrenTabName } = useParams()
  const api = useContext(ApiContext)
  const [ActionComponent, setActionComponent] = useState(null)
  const closeAction = useCallback(() => setActionComponent(null), [])

  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)
  const [message, setMessage] = useState('')
  const getNotification = useOpenNotification()

  const reloadSidebarTaskCounters = useContext(LoadTasks)
  const updateTabStateUpdaterByName = UseTabStateUpdaterByName()
  const updateCurrentTabChildrenStates = updateTabChildrenStates()
  const currentTabChildrenState = useReadCurrentChildrenTabContext()

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
          updateTabStateUpdaterByName([TASK_LIST], setUnFetchedState())
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
  }, [
    api,
    getNotification,
    id,
    reloadSidebarTaskCounters,
    updateTabStateUpdaterByName,
  ])

  const [tabState, setTabState] = useTabItem({
    stateId: ITEM_TASK,
  })

  const [
    {
      data: {
        previousTaskReport,
        documentActions,
        taskActions,
        documentTabs,
        values,
        id: documentId,
      } = {},
      data,
      reloadData,
    },
  ] = useAutoReload(loadData, tabState, setTabState)
  const docId = useMemo(() => {
    let v = 'Документ'
    if (values) {
      v =
        type === titleName
          ? values.dss_code || values.dss_ipr_number
          : values.dss_reg_number
    }

    return v
  }, [type, values])

  useSetTabName(useCallback(() => docId, [docId]))

  const setComponent = useCallback((Comp) => {
    setActionComponent(Comp)
  }, [])

  const refValues = useRef()
  useEffect(() => {
    refValues.current = values
  }, [values])

  //data
  //taskId
  //signal ?
  //refValues.current
  //type
  //documentId
  // data (task state)

  // actions
  // closeCurrenTab
  // getNotification
  // reloadData document/task state
  // setComponent
  // closeCurrenTab
  // updateCurrentTabChildrenStates TASK_ITEM_APPROVAL_SHEET
  // updateTabStateUpdaterByName  TASK_LIST
  // reloadSidebarTaskCounters
  // setMessage
  // onCloseTab
  // currentTabIndex
  // onClose - стейт модалки

  //todo дополнить экшенами из окон

  // task actions
  // reject_sap_prepare
  // reject_consider
  // apsd_prepare_reject
  // reject_prepare
  // finish_simple_approve
  // reject_approve
  // on_consider

  // document actions
  // save - в тасках есть апдейты дата, жц, уведомления, а в документах нет
  // send_to_eehd -в тасках есть апдейты дата, жц, уведомления, а в документах нет
  // send_letter -в тасках есть апдейты дата, жц, уведомления, а в документах нет
  // apsd_canceled - одинаково
  // download_template_letter - одинаково
  // additional_agreement - только таск
  // apsd_reject_cancel - одинаково
  // apsd_cancel - одинаково
  // print_card - одинаково
  // delete - только в документе
  // defaultHandler - одинаково

  const TaskHandlers = useMemo(
    () => ({
      // TODO: смержить с вероникой все дефаулт хэндлеры
      // TODO разобраться с набором действий  по завершению экшена
      // TODO потенциально все открытия документов  - промисы резолвящие экшен
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
            reloadData()
            updateCurrentTabChildrenStates(
              [TASK_ITEM_APPROVAL_SHEET],
              setUnFetchedState(),
            )
            updateTabStateUpdaterByName([TASK_LIST], setUnFetchedState())
            reloadSidebarTaskCounters()
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: defaultTaskIcon[name] || DefaultIcon,
      }),
      reject_sap_prepare: {
        handler: () =>
          setComponent({
            Component: (props) => (
              <RejectSapPrepareWindow
                signal={'reject_sap_prepare'}
                {...props}
              />
            ),
          }),
        icon: defaultTaskIcon['reject_sap_prepare'],
      },
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
            const {
              [childrenTabName]: filterFunc = filterManipulationData.remarks,
            } = filterManipulationData
            const filter = filterFunc(currentTabChildrenState)

            const { data: { stages = [] } = {} } = await api.post(
              URL_REMARK_LIST,
              {
                documentId,
                filter,
                sort: [
                  {
                    direction: 'ASC',
                    property: 'remarkCreationDate',
                  },
                ],
              },
            )

            const isOpen =
              !!stages.length &&
              stages?.some(({ iterations }) =>
                iterations.some(({ remarks }) =>
                  remarks.some(({ setRemark }) => setRemark === true),
                ),
              )
            if (isOpen) {
              setComponent({
                Component: (props) => (
                  <ViewAdditionsRemarks
                    closeCurrenTab={closeCurrenTab}
                    taskId={id}
                    stages={stages}
                    reloadData={reloadData}
                    {...props}
                  />
                ),
              })
            } else {
              try {
                const { status } = await api.post(URL_TASK_COMPLETE, {
                  taskId: id,
                  signal: 'finish_simple_approve',
                })
                closeCurrenTab()
                getNotification(customMessagesFuncMap[status]())
                reloadData()
                updateCurrentTabChildrenStates(
                  [TASK_ITEM_APPROVAL_SHEET],
                  setUnFetchedState(),
                )
                updateTabStateUpdaterByName([TASK_LIST], setUnFetchedState())
                reloadSidebarTaskCounters()
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
            }
          } catch (e) {
            const { response: { status = 0, data = '' } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: defaultTaskIcon['finish_simple_approve'] || DefaultIcon,
      },
      reject_approve: {
        handler: () =>
          setComponent({
            Component: (props) => (
              <RejectApproveWindow
                title="Выберите этап, на который будет возвращен том после доработки"
                signal="reject_approve"
                {...props}
              />
            ),
          }),
        icon: defaultTaskIcon['reject_approve'],
      },
      on_consider: {
        handler: () =>
          setComponent({
            Component: (props) => (
              <RejectApproveWindow
                title="Выберите этап для повторного рассмотрения"
                signal="on_consider"
                stageTypes={['apsd_sap_consider']}
                {...props}
              />
            ),
          }),
        icon: defaultTaskIcon['on_consider'],
      },
    }),
    [
      api,
      childrenTabName,
      closeCurrenTab,
      currentTabChildrenState,
      documentId,
      getNotification,
      id,
      reloadData,
      reloadSidebarTaskCounters,
      setComponent,
      updateCurrentTabChildrenStates,
      updateTabStateUpdaterByName,
    ],
  )

  const documentHandlers = useMemo(
    () => ({
      save: {
        handler: async () => {
          try {
            const { status } = await api.post(URL_DOCUMENT_UPDATE, {
              values: refValues.current,
              type,
              id: documentId,
            })
            getNotification(customMessagesFuncMap[status]())
            reloadData()
            updateCurrentTabChildrenStates(
              [TASK_ITEM_APPROVAL_SHEET],
              setUnFetchedState(),
            )
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
            reloadData()
            updateCurrentTabChildrenStates(
              [TASK_ITEM_APPROVAL_SHEET],
              setUnFetchedState(),
            )
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
            reloadData()
            updateCurrentTabChildrenStates(
              [TASK_ITEM_APPROVAL_SHEET],
              setUnFetchedState(),
            )
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
          setComponent({
            Component: (props) => (
              <CreatingAdditionalAgreementWindowWrapper
                {...props}
                data={data}
              />
            ),
          }),
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
            reloadData()
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
      print_card: {
        icon: defaultTaskIcon['print_card'],
        handler: () =>
          tomeName === type &&
          setComponent({
            Component: (props) => <PrintCardWindow {...props} />,
          }),
      },
      change_stage: {
        icon: defaultTaskIcon['change_stage'],
        handler: () =>
          setComponent({
            Component: (props) => (
              <ChangeStageWindow {...props} reloadData={reloadData} />
            ),
          }),
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
            reloadData()
            updateCurrentTabChildrenStates(
              [TASK_ITEM_APPROVAL_SHEET],
              setUnFetchedState(),
            )
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
      data,
      documentId,
      getNotification,
      id,
      reloadData,
      reloadSidebarTaskCounters,
      setComponent,
      type,
      updateCurrentTabChildrenStates,
    ],
  )

  const wrappedTaskActions = useDocumentActions(taskActions, TaskHandlers)

  const wrappedDocumentActions = useDocumentActions(
    documentActions,
    documentHandlers,
  )

  const closeModalWindow = useCallback(() => setMessage(''), [])
  return (
    <DocumentTypeContext.Provider value={ITEM_TASK}>
      <DocumentIdContext.Provider value={documentId}>
        <Document documentTabs={useDocumentTabs(documentTabs, defaultPages)}>
          <SideBar>
            <ScrollBar>
              {data && <DocumentInfoComponent {...data} />}
              <Report previousTaskReport={previousTaskReport} />
              <WrapperDocumentActions documentActions={wrappedTaskActions} />
              <WrapperDocumentActions
                documentActions={wrappedDocumentActions}
              />
            </ScrollBar>
          </SideBar>
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
