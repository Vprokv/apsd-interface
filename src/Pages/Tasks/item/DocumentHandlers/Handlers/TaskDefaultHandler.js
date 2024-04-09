import { URL_TASK_PROMOTE } from '@/ApiList'
import { TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import { defaultTaskIcon } from '@/Pages/Tasks/item/constants'
import DefaultIcon from '@/Pages/Tasks/item/Icons/DefaultIcon.svg'

export default {
  handler: async () => {
    try {
      const { status } = await api.post(URL_TASK_PROMOTE, {
        id,
        type,
        signal: name,
      })
      getNotification(customMessagesFuncMap[status]())
      reloadData()
      updateCurrentTabChildrenStates(
        [TASK_ITEM_APPROVAL_SHEET],
        setUnFetchedState(),
      )
      reloadSidebarTaskCounters()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  },
  icon: defaultTaskIcon[name] || DefaultIcon,
}
