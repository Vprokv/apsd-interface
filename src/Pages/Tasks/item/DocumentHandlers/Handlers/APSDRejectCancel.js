import { URL_BUSINESS_DOCUMENT_RECALL } from '@/ApiList'
import ReCancelIcon from '@/Pages/Tasks/item/Icons/ReCancelIcon.svg'

export default {
  key: 'apsd_reject_cancel',
  handler: async ({
    id,
    type,
    api,
    getNotification,
    messagesMap,
    reloadDocument,
  }) => {
    try {
      const { status } = await api.post(URL_BUSINESS_DOCUMENT_RECALL, {
        documentId: id,
        documentType: type,
        signal: 'apsd_reject_cancel',
      })
      getNotification(messagesMap[status]())
      reloadDocument()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(messagesMap[status](data))
    }
  },
  icon: ReCancelIcon,
}
