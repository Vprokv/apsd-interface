const selfFilter = () => (fieldState) => (filters) => {
  filters.forEach((acc, { filter, field }) => {
    if (filter) {
      fieldState.props.filter = {
        ...fieldState.props.filter,
        [field]: filter,
      }
    }
    return acc
  })
}

export default selfFilter
