import withReferenceComponent from './FilterTypes/DependsOn'
import SelfFilter from './FilterTypes/SelfFilter'
import ReferenceFilterWrapper from './ReferenceFilterWrapper'
import { TYPE_ORGSTRUCTURE } from '../../constants'

const filtersType = {
  self: SelfFilter,
  depends_on: withReferenceComponent,
}

const wrappersMap = {
  [TYPE_ORGSTRUCTURE]: () => {},
}

const selectComponent = (conf) => {
  const {
    type,
    backConfig: { filters },
    nextProps,
  } = conf

  if (!filters) {
    if (nextProps.loadFunction) {
      // remove curry from loadFunction
      nextProps.loadFunction = nextProps.loadFunction()
    }
    return
  }

  const { [type]: wrapper = ReferenceFilterWrapper } = wrappersMap

  wrapper(conf)

  filters
    .reduce((acc, filter) => {
      if (!acc.has(filter.type)) {
        acc.set(filter.type, [])
      }
      acc.get(filter.type).push(filter)
      return acc
    }, new Map())
    .forEach((filters, type) => filtersType[type](conf, filters))
}

export default selectComponent
