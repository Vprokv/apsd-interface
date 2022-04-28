import dayjs from "dayjs"

import {
  VALIDATION_RULE_BIG_DATE_THEN,
  VALIDATION_RULE_LESS_DATE_THEN,
  VALIDATION_RULE_SAME,
  VALIDATION_RULE_PASSWORD,
  VALIDATION_RULE_REQUIRED
} from './constants'

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")

export default {
  [VALIDATION_RULE_BIG_DATE_THEN]: {
    resolver({ value, ruleArgs: [fieldKey], formPayload: { [fieldKey]: sameField } }) {
      return dayjs(value, "DD.MM.YYYY").valueOf() >= dayjs(sameField, "DD.MM.YYYY").valueOf()
    },
    message: "End date must bee bigger than start date"
  },
  [VALIDATION_RULE_LESS_DATE_THEN]: {
    resolver({ value, ruleArgs: [fieldKey], formPayload: { [fieldKey]: sameField } }) {
      return dayjs(value, "DD.MM.YYYY").valueOf() <= dayjs(sameField, "DD.MM.YYYY").valueOf()
    },
    message: "Start date must bee less than end date"
  },
  [VALIDATION_RULE_SAME]: {
    resolver: ({ value, args: {fieldKey}, formPayload: { [fieldKey]: sameField } }) => value === sameField,
    message: ({ args: {fieldKey, fieldKeyLabel = fieldKey} }) => `Значение поля ${fieldKeyLabel} должно совпадать.`
  },
  [VALIDATION_RULE_PASSWORD]: {
    resolver: ({ value }) => strongRegex.test(value),
    message: "The value of field is required."
  },
  [VALIDATION_RULE_REQUIRED]: {
    resolver: ({ value }) => {
      if (typeof value === "string") {
        return String(value).replace(/\s/g, "").length > 0
      }
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return !(value === undefined || value === null)
    },
    nullAble: true,
    message: "Поле обязательно к заполнению"
  }
}
