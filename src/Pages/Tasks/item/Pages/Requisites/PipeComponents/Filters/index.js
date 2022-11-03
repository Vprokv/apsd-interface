import orgStructureFilters from './OrgStructureFilters'
import withReferenceComponent from './ReferenceFilter'

import { TYPE_ORGSTRUCTURE } from '../../constants'

const typesMap = {
  [TYPE_ORGSTRUCTURE]: orgStructureFilters,
}

const selectComponent = ({ type, backConfig: { filters }, nextProps }) => {
  if (!filters) {
    if (nextProps.loadFunction) {
      // remove curry from loadFunction
      nextProps.loadFunction = nextProps.loadFunction()
    }
    return
  }
  const { [type]: wrapper = withReferenceComponent } = typesMap
  nextProps.filters = filters
  nextProps.component = wrapper(nextProps.component)
}

export default selectComponent
