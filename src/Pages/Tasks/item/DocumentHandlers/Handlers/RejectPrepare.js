import RejectPrepareWindow from '@/Pages/Tasks/item/Components/RejectPrepareWindow'
import { defaultTaskIcon } from '@/Pages/Tasks/item/constants'

export default {
  handler: ({ openComponent }) =>
    openComponent({
      Component: (props) => (
        <RejectPrepareWindow signal={'reject_prepare'} {...props} />
      ),
    }),
  icon: defaultTaskIcon['reject_prepare'],
}