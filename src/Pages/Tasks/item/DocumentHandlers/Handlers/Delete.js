import { URL_BASKET_ADD } from '@/ApiList'
import { TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import DeleteIcon from '@/Pages/Tasks/item/Icons/DeleteIcon.svg'

export default {
  handler: async ({
    id,
    api,
    getNotification,
    messagesMap,
    setMessage,
    reloadDocument,
    updateCurrentTabChildrenStates,
  }) => {
    try {
      const { data, status } = await api.post(URL_BASKET_ADD, {
        documentIds: [id],
      })
      setMessage(data)
      reloadDocument()
      updateCurrentTabChildrenStates(
        [TASK_ITEM_APPROVAL_SHEET],
        setUnFetchedState(),
      )
      getNotification(messagesMap[status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(messagesMap[status](data))
    }
  },
  icon: DeleteIcon,
}
