import withReferenceComponent from './FilterTypes/DependsOn'
import SelfFilter from './FilterTypes/SelfFilter'
import ReferenceFilterWrapper from './ReferenceFilterWrapper'
import { TYPE_ORGSTRUCTURE } from '../../constants'

const filtersType = {
  self: SelfFilter,
  depends_on: withReferenceComponent,
}

const wrappersMap = {
  [TYPE_ORGSTRUCTURE]: (conf) => {
    const {
      nextProps,
      backConfig: { dss_attr_name },
      documentType,
    } = conf

    nextProps.filter = { source: `${documentType}.${dss_attr_name}` }
  },
}

const selectComponent = (conf) => {
  const {
    type,
    backConfig: { filters, dss_attr_label },
    nextProps,
  } = conf

  const { [type]: wrapper = ReferenceFilterWrapper } = wrappersMap

  if (type === "Orgstructure") {
    console.log(dss_attr_label, filters)
  }

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
