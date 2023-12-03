import CancelWindow from '@/Pages/Tasks/item/Components/CancelWindow'
import CancelIcon from '@/Pages/Tasks/item/Icons/CancelIcon.svg'

export default {
  key: 'apsd_cancel',
  handler: ({ openComponent, type }) =>
    openComponent({
      Component: (props) => (
        <CancelWindow signal="apsd_cancel" documentType={type} {...props} />
      ),
    }),
  icon: CancelIcon,
}
