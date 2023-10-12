const parsePlainProps =
  () =>
  (fieldState) =>
  ({
    attr: { dss_attr_name, dss_attr_label, dss_placeholder, dsb_readonly },
  }) => {
    fieldState.props.id = dss_attr_name
    fieldState.props.label = dss_attr_label
    fieldState.props.placeholder = dss_placeholder
    fieldState.props.disabled = dsb_readonly
  }

export default parsePlainProps
