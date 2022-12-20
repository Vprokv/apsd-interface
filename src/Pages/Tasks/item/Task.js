import { useCallback, useContext, useMemo, useState } from 'react'
import Document from './Components/Layout'
import { URL_TASK_COMPLETE, URL_TASK_ITEM, URL_TASK_MARK_READ } from '@/ApiList'
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
import useDocumentActions from './Hooks/useDocumentActions'
import DocumentActions from '@/Pages/Tasks/item/Components/DocumentActions'
import { SidebarContainer } from './styles'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import PrintIcon from './Icons/PrintIcon.svg'
import CreatingAdditionalAgreementWindow from './Components/CreatingAdditionalAgreementWindow'
import { CurrentTabContext, TabStateManipulation } from '@Components/Logic/Tab'
import UploadDoc from '@/Pages/Tasks/item/Icons/UploadDoc.svg'
import Report from '@/Pages/Tasks/item/Components/Report'

const Task = () => {
  const { id } = useParams()
  const api = useContext(ApiContext)
  const [idDocument, setIdDocument] = useState('')
  const [showWindow, setShowWindow] = useState(false)
  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)

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
        values: { dss_work_number = 'Документ' } = {},
        approverId,
      } = {},
    },
  } = tabItemState

  console.log(previousTaskReport, 'previousTaskReport')

  useSetTabName(useCallback(() => dss_work_number, [dss_work_number]))

  useAutoReload(loadData, tabItemState)

  const closeWindow = useCallback(() => {
    setShowWindow(false)
  }, [])

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
          } catch (_) {}
        },
        icon: defaultTaskIcon[name] || DefaultIcon,
      }),
    }),
    [api, closeCurrenTab, id],
  )

  const wrappedTaskActions = useDocumentActions(taskActions, TaskHandlers)

  const wrappedDocumentActions = useDocumentActions(documentActions, {
    ...defaultDocumentHandlers,
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
      </DocumentIdContext.Provider>
    </DocumentTypeContext.Provider>
  )
}

export default Task
