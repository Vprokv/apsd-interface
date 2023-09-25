import Approwers from './Approvers'
import StageRowComponent from './StageRowComponent'
import AdditionalStage from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/AdditionalStage'

const componentLevelMap = {
  0: StageRowComponent,
  1: Approwers,
  2: AdditionalStage,
  3: Approwers,
  4: AdditionalStage,
}

const RowSelector = (props) => {
  const { [props.level]: Component = componentLevelMap[0] } = componentLevelMap

  return <Component {...props} RowC={Approwers} />
}

export default RowSelector
