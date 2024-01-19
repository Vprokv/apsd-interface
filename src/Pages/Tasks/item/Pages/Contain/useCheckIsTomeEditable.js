import { isObject } from 'lodash'

// const STATUS_SEND = 'Передан'

const useCheckIsTomeEditable = ({ action: { saveTom } = {} }, key) =>
  isObject(saveTom) && saveTom[key]
// && status === STATUS_SEND

export default useCheckIsTomeEditable
