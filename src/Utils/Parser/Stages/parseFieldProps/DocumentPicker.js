import getFilters from './Stages/FilterStage'
import parseMultiply from './Stages/parseMultiply'
import ParsePlainProps from './Stages/parsePlainProps'

export const DocumentPickerProps =
  () =>
  (fieldState) =>
  ({ attr: { dss_component_reference, dss_display_template } }) => {
    fieldState.props.filter = {
      ...fieldState.props.filter,
      type: dss_component_reference[0],
    }
    fieldState.props.displayName = dss_display_template
    fieldState.props.valueKey = 'id'
    fieldState.props.labelKey = 'displayName'
    fieldState.props.refKey = 'documentSelect'
  }

export default [ParsePlainProps, getFilters, parseMultiply, DocumentPickerProps]
