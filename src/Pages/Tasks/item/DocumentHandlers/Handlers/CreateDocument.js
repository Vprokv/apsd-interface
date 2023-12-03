import { URL_DOCUMENT_CREATE } from '@/ApiList'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import SaveIcon from '@/Pages/Tasks/item/Icons/SaveIcon.svg'

export default {
  handler: async ({
    remoteTabUpdater,
    initialState,
    values,
    type,
    api,
    getNotification,
    messagesMap,
    navigate,
    setDocumentState,
  }) => {
    try {
      const {
        status,
        data: { id },
      } = await api.post(URL_DOCUMENT_CREATE, {
        values: values,
        type,
      })
      getNotification(messagesMap[status]())
      if (initialState.parentTabName) {
        remoteTabUpdater(initialState.parentTabName, setUnFetchedState())
      }
      navigate(`/document/${id}/${type}`)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(messagesMap[status](data))
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
}
