const parseMultiply =
  () =>
  (fieldState) =>
  ({ attr: { dsb_multiply } }) => {
    fieldState.props.multiple = dsb_multiply
  }

export default parseMultiply
