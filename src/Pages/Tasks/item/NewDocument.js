import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import {
  ApiContext,
  TASK_ITEM_NEW_DOCUMENT,
  TASK_ITEM_REQUISITES,
} from '@/contants'
import {
  URL_DOCUMENT_CLASSIFICATION,
  URL_DOCUMENT_CREATE,
  URL_TITLE_CHECK_DOUBLE,
} from '@/ApiList'
import { defaultPages, DocumentTypeContext } from './constants'
import { useNavigate, useParams } from 'react-router-dom'
import Document from './Components/Layout'
import useDocumentTabs from './Hooks/useDocumentTabs'
import DocumentActions from '@/Pages/Tasks/item/Components/DocumentActions'
import useDocumentActions from './Hooks/useDocumentActions'
import SaveIcon from '@/Pages/Tasks/item/Icons/SaveIcon.svg'
import {
  setUnFetchedState,
  useAutoReload,
  useSetTabName,
  useTabInitialState,
  useTabItem,
} from '@Components/Logic/Tab'
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { useTabStateUpdaterByName } from '@/Utils/TabStateUpdaters'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import SideBar from '@/Pages/Tasks/item/Components/SideBar'
import useRequisitesInfo from '@/Pages/Tasks/item/Hooks/useRequisitesInfo'
import CheckDoubleWindow from '@/Pages/Tasks/item/Components/CheckDobleWindow'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Документ создан',
    }
  },
  412: (message, err) => {
    return {
      type: NOTIFICATION_TYPE_ERROR,
      message: err ? 'Заполните обязательные поля' : message,
    }
  },
}

const titleName = 'ddt_startup_complex_type_doc'

export const NewTaskItem = ({ classificationId, type }) => {
  const api = useContext(ApiContext)
  const navigate = useNavigate()
  const getNotification = useOpenNotification()
  const [ActionComponent, setActionComponent] = useState(null)
  const closeAction = useCallback(() => setActionComponent(null), [])
  const [tabItemState, setTabItemState] = useTabItem({
    stateId: TASK_ITEM_REQUISITES,
  })

  const [documentState, setDocumentState] = useTabItem({
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
  ] = useAutoReload(loadData, documentState, setDocumentState)

  useSetTabName(useCallback(() => dss_work_number, [dss_work_number]))

  const refValues = useRef()
  useEffect(() => {
    refValues.current = values
  }, [values])

  const remoteTabUpdater = useTabStateUpdaterByName()

  const {
    documentState: { validationState },
  } = useRequisitesInfo({
    TASK_ITEM_NEW_DOCUMENT,
    permits: [],
    tabItemState,
    setTabItemState,
    documentState,
    setDocumentState,
  })
  // todo обсудить необходимость делать через validator

  // const errors = validator.validate(refValues.current, rules)

  const documentHandlers = useMemo(
    () => ({
      save: {
        handler: async () => {
          if (!validationState?.formValid) {
            return setDocumentState({
              validationState: {
                submitFailed: true,
                hasSubmitted: true,
                ...validationState,
              },
            })
          }

          try {
            if (type === titleName) {
              const { data } = await api.post(URL_TITLE_CHECK_DOUBLE, {
                sapCode: refValues.current.dss_ipr_number,
              })

              if (data.length) {
                return setActionComponent({
                  Component: (props) => (
                    <CheckDoubleWindow
                      {...props}
                      data={data}
                      values={refValues.current}
                      type={type}
                      initialState={initialState}
                      setDocumentState={setDocumentState}
                    />
                  ),
                })
              }
            }

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
            if (status === 412) {
              const { 1: responseError } = data.split(' - ')
              getNotification(
                customMessagesFuncMap[status](data, responseError),
              )

              setDocumentState({
                validationState: {
                  ...validationState,
                  submitFailed: true,
                  hasSubmitted: true,
                },
                backendValidationErrors: responseError
                  .split(',')
                  .reduce((acc, key) => {
                    acc[key.trim()] = 'Поле заполненно неверно'
                    return acc
                  }, {}),
              })
            } else {
              getNotification(customMessagesFuncMap[status](data))
            }
          }
        },
        icon: SaveIcon,
      },
    }),
    [
      api,
      getNotification,
      initialState,
      navigate,
      remoteTabUpdater,
      setDocumentState,
      type,
      validationState,
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
      {ActionComponent && (
        <ActionComponent.Component open={true} onClose={closeAction} />
      )}
    </DocumentTypeContext.Provider>
  )
}

NewTaskItem.propTypes = {
  classificationId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default () => <NewTaskItem {...useParams()} />
