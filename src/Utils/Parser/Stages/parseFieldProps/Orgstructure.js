import getFilters from './Stages/FilterStage'
import parseMultiply from './Stages/parseMultiply'
import ParsePlainProps from './Stages/parsePlainProps'

export default [
  ParsePlainProps,
  getFilters,
  parseMultiply,
  () => (fieldState) => () => {
    fieldState.props.refKey = 'userSelect'
  },
]
