import {
  accepted as acceptedValidator,
  dateAfter,
  dateBefore,
  digitsInIntegerValue,
  emptyIfOtherFieldHasValue,
  ifAllTargetsEmpty,
  ifAllTargetsFilled,
  ifEveryTargetEqualValue,
  ifSomeTargetsEmpty,
  ifTargetFieldEqualValue,
  integer as integerValidator,
  isDateAfterOrEqual,
  isDateBeforeOrEqual,
  isDateValid,
  maxLength,
  minLength,
  required as requiredValidator,
  size as sizeValidator,
  testRegex,
} from '@Components/Logic/Validator'
import createRegExpFromString from '@Components/Utils/createRegExpFromString'
import { DATE_FORMAT_DD_MM_YYYY_HH_mm_ss } from '@/contants'

export const accepted = () => ({ validatorObject: acceptedValidator })
export const size = (size) => ({
  validatorObject: sizeValidator,
  args: { size },
})
export const digits = (digits) => ({
  validatorObject: digitsInIntegerValue,
  args: { digits },
})
export const integer = () => ({ validatorObject: integerValidator })
export const min = (min) => ({ validatorObject: minLength, args: { min } })
export const max = (max) => ({ validatorObject: maxLength, args: { max } })
export const null_if = (fieldKey, fieldValue) => ({
  validatorObject: emptyIfOtherFieldHasValue,
  args: { fieldKey, fieldValue },
})
export const regex = (regex) => ({
  validatorObject: testRegex,
  args: { regex: createRegExpFromString(regex) },
})
export const date = (date) => ({ validatorObject: isDateValid, args: { date } })
export const before = (before) => ({
  validatorObject: dateBefore,
  args: { before, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss },
})
export const before_or_equal = (before_or_equal) => ({
  validatorObject: isDateBeforeOrEqual,
  args: { before_or_equal, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss },
})
export const after = (after) => ({
  validatorObject: dateAfter,
  args: { after, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss },
})
export const after_or_equal = (after_or_equal) => ({
  validatorObject: isDateAfterOrEqual,
  args: { after_or_equal, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss },
})
export const required = () => ({ validatorObject: requiredValidator })
export const required_if = (fieldKey, fieldValue) => ({
  validatorObject: requiredValidator,
  ruleGuard: ifTargetFieldEqualValue,
  ruleGuardArgs: { fieldKey, fieldValue },
})
export const required_with_all = (...fieldKey) => ({
  validatorObject: requiredValidator,
  ruleGuard: ifAllTargetsFilled,
  ruleGuardArgs: { fieldKey },
})
export const required_without_all = (...fieldKey) => ({
  validatorObject: requiredValidator,
  ruleGuard: ifAllTargetsEmpty,
  ruleGuardArgs: { fieldKey },
})
export const required_without = (...fieldKey) => ({
  validatorObject: requiredValidator,
  ruleGuard: ifSomeTargetsEmpty,
  ruleGuardArgs: { fieldKey },
})

export const required_if_every = (...fieldKey) => {
  const fieldKeysCopy = [...fieldKey]
  const params = fieldKeysCopy.splice(-2, 2) // отрезаем название функции и значение
  return {
    validatorObject: requiredValidator,
    ruleGuard: ifEveryTargetEqualValue,
    ruleGuardArgs: {
      fieldKeys: fieldKeysCopy,
      targetValue: params[0] === 'empty' ? '' : params[0],
    },
  }
}

export const defaultForJson = (values) => {
  const { attribute, filter } = (values && JSON.parse(values)) || {}

  return {
    validatorObject: requiredValidator,
    ruleGuard: ifTargetFieldEqualValue,
    ruleGuardArgs: { fieldKey: attribute, fieldValue: filter },
  }
}

const validationRules = {
  accepted,
  size,
  digits,
  integer,
  min,
  max,
  null_if,
  regex,
  date,
  before,
  before_or_equal,
  after,
  after_or_equal,
  required,
  required_if,
  required_with_all,
  required_without_all,
  required_without,
  required_if_every,
  defaultForJson,
}

export default validationRules
