import { URL_TASK_COMPLETE } from '@/ApiList'
import { TASK_ITEM_APPROVAL_SHEET, TASK_LIST } from '@/contants'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import AboutRemarkWindow from '@/Pages/Tasks/item/Components/AboutRemarkWindow'
import { defaultTaskIcon } from '@/Pages/Tasks/item/constants'
import DefaultIcon from '@/Pages/Tasks/item/Icons/DefaultIcon.svg'

export const filterManipulationData = {
  'approval-sheet/': () => ({
    allStages: false,
    allIteration: false,
    isApprove: true,
  }),
  remarks: ({ filter: { allStages = true, allIteration = true } = {} }) => ({
    allStages,
    allIteration,
    isApprove: false,
  }),
}

export default {
  key: 'finish_simple_approve',
  handler: async ({
    reloadSidebarTaskCounters,
    openComponent,
    api,
    id,
    closeCurrenTab,
    getNotification,
    messagesMap,
  }) => {
    // TODO в оригинале релоад документ и детей, но таб закрывается
    try {
      const { status } = await api.post(URL_TASK_COMPLETE, {
        taskId: id,
        signal: 'finish_simple_approve',
      })
      getNotification(messagesMap[status]())
      reloadSidebarTaskCounters()
      updateTabStateUpdaterByName([TASK_LIST], setUnFetchedState())
      closeCurrenTab()
    } catch (e) {
      const { response: { status, data } = {} } = e
      if (status === 412 && data === 'finish_without_remarks') {
        return openComponent({
          Component: (props) => (
            <AboutRemarkWindow signal={'finish_without_remark'} {...props} />
          ),
        })
      }
      getNotification(messagesMap[status](data))
    }
  },
  icon: defaultTaskIcon['finish_simple_approve'] || DefaultIcon,
}
