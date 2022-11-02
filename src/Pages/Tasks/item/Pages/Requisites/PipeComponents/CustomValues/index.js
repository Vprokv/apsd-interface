import orgStructureCustomValues from './OrgStructureCustomValues'
import referenceCustomValues from './ReferenceCustomValues'
import { TYPE_ORGSTRUCTURE } from '../../constants'

const typesMap = {
  [TYPE_ORGSTRUCTURE]: orgStructureCustomValues,
}

const selectComponent = ({ type, nextProps }) => {
  const { [type]: wrapper = referenceCustomValues } = typesMap

  nextProps.component = wrapper(nextProps.component)
}

export default selectComponent
