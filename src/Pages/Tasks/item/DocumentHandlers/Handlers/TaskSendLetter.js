import DefaultIcon from '@/Pages/Tasks/item/Icons/DefaultIcon.svg'
import SendLetter from './SendLetter'
import { TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import { setUnFetchedState } from '@Components/Logic/Tab'

export default {
  handler: async (requestObject) => {
    const { updateCurrentTabChildrenStates, reloadSidebarTaskCounters } =
      requestObject
    await SendLetter.handler(requestObject)
    updateCurrentTabChildrenStates(
      [TASK_ITEM_APPROVAL_SHEET],
      setUnFetchedState(),
    )
    reloadSidebarTaskCounters()
  },
  icon: DefaultIcon,
}
