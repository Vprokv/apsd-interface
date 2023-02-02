import { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { ApiContext, ITEM_DOCUMENT, TASK_ITEM_NEW_DOCUMENT } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_DOCUMENT_CLASSIFICATION, URL_DOCUMENT_CREATE } from '@/ApiList'
import { defaultPages, DocumentTypeContext } from './constants'
import { useNavigate, useParams } from 'react-router-dom'
import Document from './Components/Layout'
import useDocumentTabs from './Hooks/useDocumentTabs'
import { SidebarContainer } from '@/Pages/Tasks/item/styles'
import DocumentActions from '@/Pages/Tasks/item/Components/DocumentActions'
import useDocumentActions from './Hooks/useDocumentActions'
import SaveIcon from '@/Pages/Tasks/item/Icons/SaveIcon.svg'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import {
  defaultMessageMap,
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_INFO,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import UseTabStateUpdaterByName from '@/Utils/UseTabStateUpdaterByName'

const customMessagesMap = {
  ...defaultMessageMap,
  412: {
    type: NOTIFICATION_TYPE_ERROR,
    message: 'Заполните обязательные поля',
  },
  200: {
    type: NOTIFICATION_TYPE_SUCCESS,
    message: 'Документ создан',
  },
}

export const NewTaskItem = ({ classificationId, type }) => {
  const api = useContext(ApiContext)
  const navigate = useNavigate()
  const getNotification = useOpenNotification()

  const {
    tabState: { data: { values: { dss_work_number = 'Документ' } = {} } = {} },
  } = useTabItem({ stateId: TASK_ITEM_NEW_DOCUMENT })

  const tabItemState = useTabItem({ stateId: TASK_ITEM_NEW_DOCUMENT })
  const {
    initialState,
    tabState: { data: { documentActions, documentTabs, values } = {} },
    setTabState: setDocumentState,
  } = tabItemState

  useSetTabName(useCallback(() => dss_work_number, [dss_work_number]))

  const remoteTabUpdater = UseTabStateUpdaterByName(initialState?.parentTabName)

  const refValues = useRef()
  useEffect(() => {
    refValues.current = values
  }, [values])

  const loadData = useCallback(async () => {
    const { valuesCustom, values } = initialState || {}
    const { data } = await api.post(URL_DOCUMENT_CLASSIFICATION, {
      classificationId,
    })
    return {
      ...data,
      values: { ...data.values, ...values },
      valuesCustom: { ...data.valuesCustom, ...valuesCustom },
    }
  }, [api, classificationId, initialState])

  useAutoReload(loadData, tabItemState)

  const documentHandlers = useMemo(
    () => ({
      save: {
        handler: async () => {
          try {
            const {
              status,
              data: { id },
            } = await api.post(URL_DOCUMENT_CREATE, {
              values: refValues.current,
              type,
            })
            getNotification(customMessagesMap[status])
            remoteTabUpdater({ loading: false, fetched: false })
            navigate(`/document/${id}/${type}`)
          } catch (e) {
            const { response: { status, data } = {} } = e
            getNotification(customMessagesMap[status])
            if (status === 412) {
              const { 1: responseError } = data.split(' - ')
              setDocumentState({
                submitFailed: true,
                formHasSubmitted: true,
                backendValidationErrors: responseError
                  .split(',')
                  .reduce((acc, key) => {
                    acc[key.trim()] = 'Поле заполненно неверно'
                    return acc
                  }, {}),
              })
            }
          }
        },
        icon: SaveIcon,
      },
    }),
    [api, getNotification, navigate, remoteTabUpdater, setDocumentState, type],
  )

  const wrappedDocumentActions = useDocumentActions(
    documentActions,
    documentHandlers,
  )

  return (
    <DocumentTypeContext.Provider value={TASK_ITEM_NEW_DOCUMENT}>
      <Document documentTabs={useDocumentTabs(documentTabs, defaultPages)}>
        <SidebarContainer>
          <DocumentActions documentActions={wrappedDocumentActions} />
        </SidebarContainer>
      </Document>
    </DocumentTypeContext.Provider>
  )
}

NewTaskItem.propTypes = {
  classificationId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default () => <NewTaskItem {...useParams()} />
