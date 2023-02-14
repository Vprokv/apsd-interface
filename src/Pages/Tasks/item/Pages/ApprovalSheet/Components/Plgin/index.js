import Approwers from './LeafTable'
import StageRowComponent from './StageRowComponent'

const RowSelector = (props) => {
  const Comp = props.level === 0 ? StageRowComponent : Approwers

  return <Comp {...props} RowC={Approwers} />
}

export default RowSelector
