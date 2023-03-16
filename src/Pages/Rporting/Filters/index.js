import withReferenceComponent from '../../Tasks/item/Pages/Requisites/PipeComponents/Filters/FilterTypes/DependsOn'
import SelfFilter from '../../Tasks/item/Pages/Requisites/PipeComponents/Filters/FilterTypes/SelfFilter'
import ReferenceFilterWrapper from '../../Tasks/item/Pages/Requisites/PipeComponents/Filters/ReferenceFilterWrapper'
import { TYPE_ORGSTRUCTURE } from '../../Tasks/item/Pages/Requisites/constants'

const filtersType = {
  self: SelfFilter,
  depends_on: withReferenceComponent,
}

const wrappersMap = {
  [TYPE_ORGSTRUCTURE]: (conf) => {},
}

const selectComponent = (conf) => {
  const {
    type,
    backConfig: { filters },
    nextProps,
  } = conf

  const { [type]: wrapper = ReferenceFilterWrapper } = wrappersMap

  if (!filters) {
    if (nextProps.loadFunction) {
      // remove curry from loadFunction
      nextProps.loadFunction = nextProps.loadFunction()
    }
    return
  }

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