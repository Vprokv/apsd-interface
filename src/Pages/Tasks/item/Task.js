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
  DocumentIdContext,
  DocumentTypeContext,
} from './constants'
import DefaultIcon from './Icons/DefaultIcon.svg'
import useDocumentActions from './Hooks/useDocumentActions'
import DocumentActions from '@/Pages/Tasks/item/Components/DocumentActions'
import { SidebarContainer } from './styles'

const Task = () => {
  const { id } = useParams()
  const api = useContext(ApiContext)
  const [idDocument, setIdDocument] = useState('')

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_TASK_ITEM, {
      taskId: id,
    })
    setIdDocument(data?.id)
    if (!data.read) {
      // не ждем запроса, он выполняеться фоном.
      api.post(URL_TASK_MARK_READ, {
        taskIds: [id],
      })
    }
    return data
  }, [api, id])

  const {
    tabState: { data: { values: { dss_work_number = 'Документ' } = {} } = {} },
  } = useTabItem({ stateId: ITEM_TASK })

  const tabItemState = useTabItem({
    setTabName: useCallback(() => dss_work_number, [dss_work_number]),
    stateId: ITEM_TASK,
  })
  const {
    tabState: { data: { documentActions, taskActions, documentTabs } = {} },
  } = tabItemState

  useAutoReload(loadData, tabItemState)

  const wrappedTaskActions = useMemo(
    () =>
      (taskActions || []).map(({ caption, name }) => ({
        key: name,
        caption,
        handler: async () => {
          await api.post(URL_TASK_COMPLETE, {
            taskId: id,
            signal: name,
          })
        },
        icon: DefaultIcon,
      })),
    [api, id, taskActions],
  )

  const wrappedDocumentActions = useDocumentActions(
    documentActions,
    defaultDocumentHandlers,
  )

  const actions = useMemo(
    () => [...wrappedTaskActions, ...wrappedDocumentActions],
    [wrappedDocumentActions, wrappedTaskActions],
  )

  return (
    <DocumentTypeContext.Provider value={ITEM_TASK}>
      <DocumentIdContext.Provider value={idDocument}>
        <Document documentTabs={useDocumentTabs(documentTabs, defaultPages)}>
          <SidebarContainer>
            <DocumentActions documentActions={actions} />
          </SidebarContainer>
        </Document>
      </DocumentIdContext.Provider>
    </DocumentTypeContext.Provider>
  )
}

export default Task
