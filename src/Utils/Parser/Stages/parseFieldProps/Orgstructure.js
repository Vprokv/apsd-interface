import getFilters from './Stages/FilterStage'
import parseMultiply from './Stages/parseMultiply'
import ParsePlainProps from './Stages/parsePlainProps'

export const setOrgstructureRefKey = () => (fieldState) => () => {
  fieldState.props.refKey = 'userSelect'
}

export default [
  ParsePlainProps,
  getFilters,
  parseMultiply,
  setOrgstructureRefKey,
]
