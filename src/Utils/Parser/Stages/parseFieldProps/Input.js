import NumericInput from '@Components/Components/Inputs/NumericInput'

const parseInputTypeProps =
  () =>
  (fieldState) =>
  ({ attr: { dm_type } }) => {
    if (dm_type === 'DM_DOUBLE') {
      fieldState.hooks.push(() => ({ component: NumericInput }))
    }
  }
export default parseInputTypeProps
