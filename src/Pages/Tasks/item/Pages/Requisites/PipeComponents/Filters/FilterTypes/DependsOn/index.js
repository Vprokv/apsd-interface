import ReferenceFilter from './ReferenceFilter'

const WithDependsOnFilter = (
  { nextProps, interceptors, backConfig },
  filters,
) => {
  nextProps.component = ReferenceFilter(nextProps.component, filters)

  filters.forEach(({ field }) => {
    if (!interceptors.has(field)) {
      interceptors.set(field, [])
    }
    interceptors.get(field).push(backConfig.dss_attr_name)
  })
}
export default WithDependsOnFilter
