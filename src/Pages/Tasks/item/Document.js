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
  URL_DOWNLOAD_FILE,
  URL_INTEGRATION_SEND_LETTER,
  URL_INTEGRATION_TOM_DOWNLOAD,
  URL_TASK_PROMOTE,
} from '@/ApiList'
import { useParams } from 'react-router-dom'
import {
  ApiContext,
  ITEM_DOCUMENT,
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
import DeleteIcon from './Icons/DeleteIcon.svg'
import SendASUD from './Icons/SendASUD.svg'
import SaveIcon from './Icons/SaveIcon.svg'
import useDocumentActions from './Hooks/useDocumentActions'
import DocumentActions from '@/Pages/Tasks/item/Components/DocumentActions'
import { FormWindow } from '@/Components/ModalWindow'
import { SecondaryGreyButton } from '@/Components/Button'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { LoadTasks } from '@/Pages/Main/constants'
import { updateTabChildrenStates } from '@/Utils/TabStateUpdaters'
import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'
import downloadFile from '@/Utils/DownloadFile'
import DownloadDocument from '@/Pages/Tasks/item/Icons/DownloadDocument.svg'
import CancelWindow from '@/Pages/Tasks/item/Components/CancelWindow'
import CancelIcon from '@/Pages/Tasks/item/Icons/CancelIcon.svg'
import ReCancelIcon from '@/Pages/Tasks/item/Icons/ReCancelIcon.svg'
import DocumentInfoComponent from '@/Pages/Tasks/item/Components/DocumentInfoComponent'
import ScrollBar from '@Components/Components/ScrollBar'
import SideBar from '@/Pages/Tasks/item/Components/SideBar'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

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
  const getNotification = useOpenNotification()
  const [ActionComponent, setActionComponent] = useState(null)
  const closeAction = useCallback(() => setActionComponent(null), [])
  const setComponent = useCallback((Comp) => {
    setActionComponent(Comp)
  }, [])
  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_DOCUMENT_ITEM, {
        id,
        type,
      })
      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, getNotification, id, type])

  const [tabState, setTabState] = useTabItem({
    stateId: ITEM_DOCUMENT,
  })
  const [
    {
      data: { documentActions, documentTabs = [], values } = {},
      data,
      reloadData,
    },
  ] = useAutoReload(loadData, tabState, setTabState)

  const documentId = useMemo(() => {
    let v = 'Документ'
    if (values) {
      v =
        type === titleName
          ? values.dss_code || values.dss_ipr_number
          : values.dss_reg_number
    }

    return v
  }, [type, values])

  useSetTabName(useCallback(() => documentId, [documentId]))

  const updateCurrentTabChildrenStates = updateTabChildrenStates()
  const updateTabStateUpdaterByName = UseTabStateUpdaterByName()

  const remoteSideBarUpdater = useContext(LoadTasks)

  const refValues = useRef()
  useEffect(() => {
    refValues.current = values
  }, [values])

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
            reloadData()
            updateCurrentTabChildrenStates(
              [TASK_ITEM_APPROVAL_SHEET],
              setUnFetchedState(),
            )
            getNotification(customMessagesFuncMap[status]())
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
          }
        },
        icon: DeleteIcon,
      },
      download_template_letter: {
        handler: async () => {
          try {
            const { data, status } = await api.post(
              URL_INTEGRATION_TOM_DOWNLOAD,
              {
                documentId: id,
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
      apsd_reject_cancel: {
        handler: async () => {
          try {
            const { status } = await api.post(URL_BUSINESS_DOCUMENT_RECALL, {
              documentId: id,
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
      defaultHandler: ({ name }) => ({
        handler: async () => {
          try {
            const { status } = await api.post(URL_TASK_PROMOTE, {
              id,
              type,
              signal: name,
            })
            remoteSideBarUpdater()
            getNotification(customMessagesFuncMap[status]())
            reloadData()
            updateCurrentTabChildrenStates(
              [TASK_ITEM_APPROVAL_SHEET],
              setUnFetchedState(),
            )
            updateTabStateUpdaterByName([TASK_LIST], setUnFetchedState())
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
      getNotification,
      id,
      reloadData,
      remoteSideBarUpdater,
      setComponent,
      setTabState,
      type,
      updateCurrentTabChildrenStates,
      updateTabStateUpdaterByName,
    ],
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
          <SideBar>
            <ScrollBar>
              {data && <DocumentInfoComponent {...data} />}
              <DocumentActions documentActions={wrappedDocumentActions} />
            </ScrollBar>
          </SideBar>
        </Layout>
        {ActionComponent && (
          <ActionComponent.Component
            open={true}
            documentId={id}
            onClose={closeAction}
            stateId={ITEM_DOCUMENT}
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

export default Document
