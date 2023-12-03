import { URL_DOCUMENT_UPDATE } from '@/ApiList'
import SaveIcon from '@/Pages/Tasks/item/Icons/SaveIcon.svg'

export default {
  handler: async ({
    values,
    type,
    id,
    api,
    getNotification,
    messagesMap,
    reloadDocument,
  }) => {
    try {
      const { status } = await api.post(URL_DOCUMENT_UPDATE, {
        values: values,
        type,
        id,
      })
      getNotification(messagesMap[status]())
      reloadDocument()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(messagesMap[status](data))
    }
  },
  icon: SaveIcon,
}
