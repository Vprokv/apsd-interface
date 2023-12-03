import { URL_DOWNLOAD_FILE, URL_INTEGRATION_TOM_DOWNLOAD } from '@/ApiList'
import { NOTIFICATION_TYPE_ERROR } from '@/Components/Notificator'
import downloadFile from '@/Utils/DownloadFile'
import DownloadDocument from '@/Pages/Tasks/item/Icons/DownloadDocument.svg'

export default {
  handler: async ({ id, api, getNotification, messagesMap }) => {
    try {
      const { data } = await api.post(URL_INTEGRATION_TOM_DOWNLOAD, {
        documentId: id,
      })

      const fileData = await api.post(
        URL_DOWNLOAD_FILE,
        {
          type: data.tableName,
          column: 'dsc_content',
          id: data.filekey,
        },
        { responseType: 'blob' },
      )

      if (fileData.data instanceof Error) {
        getNotification({
          type: NOTIFICATION_TYPE_ERROR,
          message: `${data.filekey} документ не найден`,
        })
      } else {
        downloadFile(fileData)
      }
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(messagesMap[status](data))
    }
  },
  icon: DownloadDocument,
}
