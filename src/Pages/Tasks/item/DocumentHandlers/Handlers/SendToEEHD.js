import { URL_CONTENT_SEND_EEHD } from '@/ApiList'
import DefaultIcon from '@/Pages/Tasks/item/Icons/DefaultIcon.svg'

export default {
  handler: async ({
    reloadDocument,
    id,
    api,
    getNotification,
    messagesMap,
  }) => {
    try {
      const { status } = await api.post(URL_CONTENT_SEND_EEHD, {
        documentId: id,
      })
      getNotification(messagesMap[status]())
      reloadDocument() // В оригинале нету
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(messagesMap[status](data))
    }
  },
  icon: DefaultIcon,
}
