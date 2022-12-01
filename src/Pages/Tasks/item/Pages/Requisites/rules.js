import {
  VALIDATION_RULE_ACCEPTED,
  VALIDATION_RULE_DATE,
  VALIDATION_RULE_DATE_AFTER,
  VALIDATION_RULE_DATE_AFTER_OR_EQUAL,
  VALIDATION_RULE_DATE_BEFORE,
  VALIDATION_RULE_DATE_BEFORE_OR_EQUAL,
  VALIDATION_RULE_DIGITS_AND_INTEGER,
  VALIDATION_RULE_INTEGER,
  VALIDATION_RULE_MAX,
  VALIDATION_RULE_MIN,
  VALIDATION_RULE_NULL_IF,
  VALIDATION_RULE_REGEX,
  VALIDATION_RULE_REQUIRED,
  VALIDATION_RULE_REQUIRED_IF,
  VALIDATION_RULE_REQUIRED_WITH_ALL,
  VALIDATION_RULE_REQUIRED_WITHOUT,
  VALIDATION_RULE_REQUIRED_WITHOUT_ALL,
  VALIDATION_RULE_SIZE,
} from '@Components/Logic/Validator/constants'
import createRegExpFromString from '@/components_ocean/Utils/createRegExpFromString'
import { DATE_FORMAT_DD_MM_YYYY_HH_mm_ss } from '@/contants'
import Classification from './Components/Classification'
import { URL_ENTITY_LIST } from '@/ApiList'
import TextArea from '@Components/Components/Inputs/TextArea'
import Input from '@Components/Components/Inputs/Input'
import Select from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'

import DocumentSelect from '@/Components/Inputs/DocumentSelect'
import DatePicker from '@/Components/Inputs/DatePicker'
import CheckBox from '@/Components/Inputs/CheckBox'
import refsTransmission from '../../../../../RefsTransmission'
import CustomValuesPipe from './PipeComponents/CustomValues'
import FiltersPipe from './PipeComponents/Filters'
import NoFieldType from '@/Components/NoFieldType'
export const VisibleIf = (key, values) => ({
  condition: `${key} === "${values[0]}"`,
})
export const VisibleIn = (key, values) => ({
  condition: `[${values.reduce(
    (acc, v) => (acc ? `${acc},"${v}"` : `"${v}"`),
    '',
  )}].includes(${key})`,
})
export const StaticVisibleIf = (key, values) => ({
  condition: `${key} === "${values[0]}"`,
  disabled: [[key], () => true],
})
export const VisibleIfNull = (key) => ({ condition: `!${key}` })
export const VisibleIfNotNull = (key) => ({ condition: `!!${key}` })

export const visibleRules = {
  visible_if: VisibleIf,
  visible_in: VisibleIn,
  static_visible_if: StaticVisibleIf,
  visible_if_null: VisibleIfNull,
  visible_if_not_null: VisibleIfNotNull,
}

export const ReadOnlyIf = (key, values) =>
  `obj.${key} === ${values.startsWith('$') ? values.slice(1) : `"${values}"`}`
export const ReadOnlyIfNot = (key, values) =>
  `obj.${key} !== ${values.startsWith('$') ? values.slice(1) : `"${values}"`}`
export const ReadOnly = () => 'true'

export const readOnlyRules = {
  readonly_if: ReadOnlyIf,
  readonly_if_not: ReadOnlyIfNot,
  readonly: ReadOnly,
}

export const accepted = () => ({ name: VALIDATION_RULE_ACCEPTED })
export const size = (size) => ({ name: VALIDATION_RULE_SIZE, args: { size } })
export const digits = (digits) => ({
  name: VALIDATION_RULE_DIGITS_AND_INTEGER,
  args: { digits },
})
export const integer = () => ({ name: VALIDATION_RULE_INTEGER })
export const min = (min) => ({ name: VALIDATION_RULE_MIN, args: { min } })
export const max = (max) => ({ name: VALIDATION_RULE_MAX, args: { max } })
export const null_if = (fieldKey, fieldValue) => ({
  name: VALIDATION_RULE_NULL_IF,
  args: { fieldKey, fieldValue },
})
export const regex = (regex) => ({
  name: VALIDATION_RULE_REGEX,
  args: { regex: createRegExpFromString(regex) },
})
export const date = (date) => ({ name: VALIDATION_RULE_DATE, args: { date } })
export const before = (before) => ({
  name: VALIDATION_RULE_DATE_BEFORE,
  args: { before, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss },
})
export const before_or_equal = (before_or_equal) => ({
  name: VALIDATION_RULE_DATE_BEFORE_OR_EQUAL,
  args: { before_or_equal, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss },
})
export const after = (after) => ({
  name: VALIDATION_RULE_DATE_AFTER,
  args: { after, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss },
})
export const after_or_equal = (after_or_equal) => ({
  name: VALIDATION_RULE_DATE_AFTER_OR_EQUAL,
  args: { after_or_equal, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss },
})
export const required = () => ({ name: VALIDATION_RULE_REQUIRED })
export const required_if = (fieldKey, fieldValue) => ({
  name: VALIDATION_RULE_REQUIRED_IF,
  args: { fieldKey, fieldValue },
})
export const required_with_all = (...fieldsKeys) => ({
  name: VALIDATION_RULE_REQUIRED_WITH_ALL,
  args: { fieldsKeys },
})
export const required_without_all = (...fieldsKeys) => ({
  name: VALIDATION_RULE_REQUIRED_WITHOUT_ALL,
  args: { fieldsKeys },
})
export const required_without = (...fieldsKeys) => ({
  name: VALIDATION_RULE_REQUIRED_WITHOUT,
  args: { fieldsKeys },
})

export const validationRules = {
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
}

const getLoadFunction = (accumulator) => {
  const {
    backConfig: { dss_component_reference, dss_attr_name },
    nextProps,
    api,
  } = accumulator

  if (dss_component_reference) {
    nextProps.loadFunction = (filters) => async () => {
      const { data } = await api.post(URL_ENTITY_LIST, {
        id: dss_attr_name,
        type: dss_component_reference,
        filters,
      })
      return data
    }
    const { valueKey, labelKey } = refsTransmission(dss_component_reference)
    nextProps.valueKey = valueKey
    nextProps.labelKey = labelKey
    nextProps.refKey = dss_component_reference
  }
  return accumulator
}

const getMultiply = (accumulator) => {
  const {
    backConfig: { dsb_multiply },
    nextProps,
  } = accumulator
  nextProps.multiple = dsb_multiply
  return accumulator
}

export const propsTransmission = {
  Classification: (accumulator) => {
    accumulator.nextProps.component = Classification
    getLoadFunction(accumulator)
    getMultiply(accumulator)
    CustomValuesPipe(accumulator)
    FiltersPipe(accumulator)
    return accumulator.nextProps
  },
  Combobox: (accumulator) => {
    accumulator.nextProps.component = Select
    getLoadFunction(accumulator)
    getMultiply(accumulator)
    CustomValuesPipe(accumulator)
    FiltersPipe(accumulator)
    return accumulator.nextProps
  },
  DocStatus: (accumulator) => {
    accumulator.nextProps.component = NoFieldType
    getLoadFunction(accumulator)
    getMultiply(accumulator)
    CustomValuesPipe(accumulator)
    FiltersPipe(accumulator)
    return accumulator.nextProps
  },
  DocumentPicker: (accumulator) => {
    accumulator.nextProps.component = DocumentSelect
    getLoadFunction(accumulator)
    getMultiply(accumulator)
    CustomValuesPipe(accumulator)
    FiltersPipe(accumulator)
    accumulator.nextProps.filters = {
      type: accumulator.backConfig.dss_component_reference[0],
    }
    accumulator.nextProps.displayName =
      accumulator.backConfig.dss_display_template
    accumulator.nextProps.valueKey = 'id'
    accumulator.nextProps.labelKey = 'displayName'
    accumulator.nextProps.refKey = 'documentSelect'
    return accumulator.nextProps
  },
  Orgstructure: (accumulator) => {
    accumulator.nextProps.component = UserSelect
    getMultiply(accumulator)
    accumulator.nextProps.refKey = 'userSelect'
    CustomValuesPipe(accumulator)
    FiltersPipe(accumulator)
    return accumulator.nextProps
  },
  Text: (accumulator) => {
    accumulator.nextProps.component = Input
    return accumulator.nextProps
  },
  TextArea: (accumulator) => {
    accumulator.nextProps.component = TextArea
    return accumulator.nextProps
  },
  Date: (accumulator) => {
    accumulator.nextProps.component = DatePicker
    return accumulator.nextProps
  },
  Checkbox: (accumulator) => {
    accumulator.nextProps.component = CheckBox
    return accumulator.nextProps
  },
  // ExpansionPanel
  // Скрывающаяся панель
  // TextualCombobox
  // Денормализованное поле ОШС
  // Выбор пользователей
  // Checkbox
  // Флаг
  // Классификация
  // Branch
  // Филиал
  // Department
  // Отдел
  // TextualBranch
  // Филиал
}
