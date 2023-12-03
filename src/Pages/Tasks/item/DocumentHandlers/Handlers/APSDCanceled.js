import { URL_BUSINESS_DOCUMENT_RECALL } from '@/ApiList'
import DefaultIcon from '@/Pages/Tasks/item/Icons/DefaultIcon.svg'

export default {
  handler: async ({ id, api, getNotification, messagesMap, setMessage }) => {
    try {
      const { data, status } = await api.post(URL_BUSINESS_DOCUMENT_RECALL, {
        documentId: id,
      })
      setMessage(data)
      getNotification(messagesMap[status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(messagesMap[status](data))
    }
  },
  icon: DefaultIcon,
}
