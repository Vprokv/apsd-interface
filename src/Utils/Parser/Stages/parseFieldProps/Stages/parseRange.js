const parseMultiply =
  () =>
  (fieldState) =>
  ({ attr: { dsb_range } }) => {
    fieldState.props.multiple = dsb_range
  }

export default parseMultiply
