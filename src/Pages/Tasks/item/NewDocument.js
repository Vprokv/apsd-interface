import { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { ApiContext, TASK_ITEM_NEW_DOCUMENT } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_DOCUMENT_CLASSIFICATION, URL_DOCUMENT_CREATE } from '@/ApiList'
import { defaultPages, DocumentTypeContext } from './constants'
import { useNavigate, useParams } from 'react-router-dom'
import Document from './Components/Layout'
import useDocumentTabs from './Hooks/useDocumentTabs'
import DocumentActions from '@/Pages/Tasks/item/Components/DocumentActions'
import useDocumentActions from './Hooks/useDocumentActions'
import SaveIcon from '@/Pages/Tasks/item/Icons/SaveIcon.svg'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { useTabStateUpdaterByName } from '@/Utils/TabStateUpdaters'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import SideBar from '@/Pages/Tasks/item/Components/SideBar'
import useTabInitialState from '@Components/Logic/Tab/useTabInitialState'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Документ создан',
    }
  },
  412: () => {
    return {
      type: NOTIFICATION_TYPE_ERROR,
      message: 'Заполните обязательные поля',
    }
  },
}

export const NewTaskItem = ({ classificationId, type }) => {
  const api = useContext(ApiContext)
  const navigate = useNavigate()
  const getNotification = useOpenNotification()

  const [tabState, setDocumentState] = useTabItem({
    stateId: TASK_ITEM_NEW_DOCUMENT,
  })
  const initialState = useTabInitialState()

  const loadData = useCallback(async () => {
    try {
      const { valuesCustom, values } = initialState || {}
      const { data } = await api.post(URL_DOCUMENT_CLASSIFICATION, {
        classificationId,
      })
      return {
        ...data,
        values: { ...data.values, ...values },
        valuesCustom: { ...data.valuesCustom, ...valuesCustom },
      }
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, classificationId, getNotification, initialState])

  const [
    {
      data: {
        documentActions,
        documentTabs,
        values,
        values: { dss_work_number = 'Документ' } = {},
      } = {},
    },
  ] = useAutoReload(loadData, tabState, setDocumentState)

  useSetTabName(useCallback(() => dss_work_number, [dss_work_number]))

  const refValues = useRef()
  useEffect(() => {
    refValues.current = values
  }, [values])

  const remoteTabUpdater = useTabStateUpdaterByName()

  console.log('check')

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
            getNotification(customMessagesFuncMap[status]())
            if (initialState?.parentTabName) {
              remoteTabUpdater(initialState.parentTabName, setUnFetchedState())
            }
            navigate(`/document/${id}/${type}`)
          } catch (e) {
            const { response: { status = 0, data = '' } = {} } = e
            getNotification(customMessagesFuncMap[status](data))
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
    [
      api,
      getNotification,
      initialState?.parentTabName,
      navigate,
      remoteTabUpdater,
      setDocumentState,
      type,
    ],
  )

  const wrappedDocumentActions = useDocumentActions(
    documentActions,
    documentHandlers,
  )

  return (
    <DocumentTypeContext.Provider value={TASK_ITEM_NEW_DOCUMENT}>
      <Document documentTabs={useDocumentTabs(documentTabs, defaultPages)}>
        <SideBar>
          <DocumentActions documentActions={wrappedDocumentActions} />
        </SideBar>
      </Document>
    </DocumentTypeContext.Provider>
  )
}

NewTaskItem.propTypes = {
  classificationId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default () => <NewTaskItem {...useParams()} />
