export default ({ backConfig: { dsb_multiply } }) =>
  (nextProps) => {
    nextProps.multiple = dsb_multiply
    return nextProps
  }
