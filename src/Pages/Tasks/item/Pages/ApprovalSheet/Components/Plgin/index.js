import Approwers from './Approvers'
import StageRowComponent from './StageRowComponent'
import AdditionalStage from "@/Pages/Tasks/item/Pages/ApprovalSheet/Components/AdditionalStage";

const componentLevelMap = {
  0: StageRowComponent,
  1: Approwers,
  2: AdditionalStage,
}

const RowSelector = (props) => {
  // console.log(props.level, props);
  const { [props.level]: Component = componentLevelMap[0] } = componentLevelMap
  // console.log(props, 'props')
  // const Comp = props.level === 0 ? StageRowComponent : Approwers

  return <Component {...props} RowC={Approwers} />
}

export default RowSelector
