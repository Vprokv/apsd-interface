const WithDependsOnFilter = ({ nextProps }, filters) => {
  if (!nextProps.filter) {
    nextProps.filter = {}
  }
  filters.forEach(({ filter, field }) => {
    if (filter) {
      nextProps.filter[field] = filter
    }
  })
}
export default WithDependsOnFilter
