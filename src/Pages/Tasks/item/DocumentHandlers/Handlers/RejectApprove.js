import { defaultTaskIcon } from '@/Pages/Tasks/item/constants'
import RejectApproveWindow from '@/Pages/Tasks/item/Components/RejectApproveWindow'

export default {
  key: 'reject_approve',
  handler: ({ openComponent }) =>
    openComponent({
      Component: RejectApproveWindow,
    }),
  icon: defaultTaskIcon['reject_approve'],
}