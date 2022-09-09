import {
  VALIDATION_RULE_ACCEPTED,
  VALIDATION_RULE_DATE,
  VALIDATION_RULE_DATE_AFTER, VALIDATION_RULE_DATE_AFTER_OR_EQUAL,
  VALIDATION_RULE_DATE_BEFORE,
  VALIDATION_RULE_DATE_BEFORE_OR_EQUAL,
  VALIDATION_RULE_DIGITS_AND_INTEGER,
  VALIDATION_RULE_INTEGER,
  VALIDATION_RULE_MAX,
  VALIDATION_RULE_MIN,
  VALIDATION_RULE_NULL_IF,
  VALIDATION_RULE_REGEX,
  VALIDATION_RULE_SIZE,
  VALIDATION_RULE_REQUIRED_IF,
  VALIDATION_RULE_REQUIRED_WITH_ALL,
  VALIDATION_RULE_REQUIRED_WITHOUT_ALL,
  VALIDATION_RULE_REQUIRED_WITHOUT, VALIDATION_RULE_REQUIRED,
} from "../../../../../components_ocean/Logic/Validator/constants";
import createRegExpFromString from "../../../../../components_ocean/Utils/createRegExpFromString";
import {DATE_FORMAT_DD_MM_YYYY_HH_mm_ss} from "../../../../../contants";

export const VisibleIf = (key, values) => ({condition: `${key} === "${values[0]}"`})
export const VisibleIn = (key, values) => ({condition: `[${values.reduce((acc, v) => acc ? `${acc},"${v}"` : `"${v}"`, "")}].includes(${key})`})
export const StaticVisibleIf = (key, values) => ({
  condition: `${key} === "${values[0]}"`,
  disabled: [[key], () => true]
})
export const VisibleIfNull = (key) => ({condition: `!${key}`})
export const VisibleIfNotNull = (key) => ({condition: `!!${key}`})

export const visibleRules = {
  "visible_if": VisibleIf,
  "visible_in": VisibleIn,
  "static_visible_if": StaticVisibleIf,
  "visible_if_null": VisibleIfNull,
  "visible_if_not_null": VisibleIfNotNull,
}

export const ReadOnlyIf = (key, values) => `${key} === "${values[0]}"`
export const ReadOnlyIfNot = (key, values) => `${key} !== "${values[0]}"`
export const ReadOnly = () => `true`

export const readOnlyRules = {
  "readonly_if": ReadOnlyIf,
  "readonly_if_not": ReadOnlyIfNot,
  "readonly": ReadOnly,
}

export const accepted = () => ({name: VALIDATION_RULE_ACCEPTED})
export const size = (size) => ({name: VALIDATION_RULE_SIZE, args: {size}})
export const digits = (digits) => ({name: VALIDATION_RULE_DIGITS_AND_INTEGER, args: {digits}})
export const integer = () => ({name: VALIDATION_RULE_INTEGER})
export const min = (min) => ({name: VALIDATION_RULE_MIN, args: {min}})
export const max = (max) => ({name: VALIDATION_RULE_MAX, args: {max}})
export const null_if = (fieldKey, fieldValue) => ({name: VALIDATION_RULE_NULL_IF, args: {fieldKey, fieldValue}})
export const regex = (regex) => ({name: VALIDATION_RULE_REGEX, args: {regex: createRegExpFromString(regex)}})
export const date = (date) => ({name: VALIDATION_RULE_DATE, args: {date}})
export const before = (before) => ({name: VALIDATION_RULE_DATE_BEFORE, args: {before, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss}})
export const before_or_equal = (before_or_equal) => ({name: VALIDATION_RULE_DATE_BEFORE_OR_EQUAL, args: {before_or_equal, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss}})
export const after = (after) => ({name: VALIDATION_RULE_DATE_AFTER, args: {after, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss}})
export const after_or_equal = (after_or_equal) => ({name: VALIDATION_RULE_DATE_AFTER_OR_EQUAL, args: {after_or_equal, format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss}})
export const required = () => ({name: VALIDATION_RULE_REQUIRED})
export const required_if = (fieldKey, fieldValue) => ({name: VALIDATION_RULE_REQUIRED_IF, args: {fieldKey, fieldValue}})
export const required_with_all = (...fieldsKeys) => ({name: VALIDATION_RULE_REQUIRED_WITH_ALL, args: {fieldsKeys}})
export const required_without_all = (...fieldsKeys) => ({name: VALIDATION_RULE_REQUIRED_WITHOUT_ALL, args: {fieldsKeys}})
export const required_without = (...fieldsKeys) => ({name: VALIDATION_RULE_REQUIRED_WITHOUT, args: {fieldsKeys}})

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
