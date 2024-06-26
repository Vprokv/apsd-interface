// парсинг пропсов DocumentPicker. с особенностями отчетов
export const parseDocumentPickerProps =
  () =>
  (fieldState) =>
  ({ attr: { dss_component_reference } }) => {
    fieldState.props.filter = {
      ...fieldState.props.filter,
      type: dss_component_reference,
    }
    fieldState.props.displayName = '${dss_description}'
    fieldState.props.valueKey = 'id'
    fieldState.props.labelKey = 'displayName'
    fieldState.props.refKey = 'documentSelect'
  }

export default parseDocumentPickerProps
