import { TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import { setUnFetchedState } from '@Components/Logic/Tab'
import SaveIcon from '@/Pages/Tasks/item/Icons/SaveIcon.svg'
import DocumentUpdate from './DocumentUpdate'

export default {
  handler: async (requestObject) => {
    const { updateCurrentTabChildrenStates, reloadSidebarTaskCounters } =
      requestObject
    await DocumentUpdate.handler(requestObject)
    updateCurrentTabChildrenStates(
      [TASK_ITEM_APPROVAL_SHEET],
      setUnFetchedState(),
    )
    reloadSidebarTaskCounters()
  },
  icon: SaveIcon,
}
