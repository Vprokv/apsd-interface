// В поиске DataPicker всегда в состоянии range
const setDataPickerRangeStage = () => (fieldState) => () => {
  fieldState.props.range = true
}

export default setDataPickerRangeStage
