import { URL_INTEGRATION_SEND_LETTER } from '@/ApiList'
import SendASUD from '@/Pages/Tasks/item/Icons/SendASUD.svg'

export default {
  handler: async ({ id, api, getNotification, messagesMap, setMessage }) => {
    try {
      const { data, status } = await api.post(URL_INTEGRATION_SEND_LETTER, {
        documentId: id,
      })
      setMessage(data)
      getNotification(messagesMap[status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(messagesMap[status](data))
    }
  },
  icon: SendASUD,
}
