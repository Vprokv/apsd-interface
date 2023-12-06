import { isObject } from 'lodash'

const STATUS_SEND = 'Передан'

const useCheckIsTomeEditable = ({ action, status }) =>
  isObject(action) && action.saveTom && status === STATUS_SEND

export default useCheckIsTomeEditable
