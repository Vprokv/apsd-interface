import RejectPrepareWindow from '@/Pages/Tasks/item/Components/RejectPrepareWindow'
import { defaultTaskIcon } from '@/Pages/Tasks/item/constants'

export default {
  key: 'reject_consider',
  handler: ({ openComponent }) =>
    openComponent({
      Component: (props) => (
        <RejectPrepareWindow signal={'apsd_prepare_reject'} {...props} />
      ),
    }),
  icon: defaultTaskIcon['apsd_prepare_reject'],
}