import refsTransmission from '@/RefsTransmission'
// TODO: этот функционал есть в отчетах, в остальных апишках бэк сам говорит нам что есть valueKey и labelKey
const refTransmissionStage =
  () =>
  (fieldState) =>
  ({ attr: { dss_component_reference } }) => {
    const { valueKey, labelKey } = refsTransmission(dss_component_reference)
    fieldState.props.valueKey = valueKey
    fieldState.props.labelKey = labelKey
  }

export default refTransmissionStage
