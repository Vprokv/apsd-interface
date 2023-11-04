const selfFilter = () => (fieldState) => (filters) => {
  filters.forEach(({ filter, field }) => {
    if (filter) {
      fieldState.props.filter = {
        ...fieldState.props.filter,
        [field]: filter,
      }
    }
  })
}

export default selfFilter
