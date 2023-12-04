import { isObject } from 'lodash'

const useCheckIsTomeEditable = ({ action }) =>
  isObject(action) && action.saveTom

export default useCheckIsTomeEditable
