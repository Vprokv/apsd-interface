import { set } from "../../Utils/ObjectPath"
import memoize from "lodash/memoize"
import rules from "./rules"

export default class Validator {
  mergeValidators = memoize((rules) => ({ ...Validator.defaultRules, ...rules }))

  parseRule = memoize((rulesObjs) => Object.entries(rulesObjs).map(([path, rules]) => [path.split("."), rules]))

  static defaultRules = rules

  validateInput = (validators) => {
    const validate = (input, path, rules, errors) => {
      let prevTempValue = input
      let tempValue = input

      for (let pathIndex = 0; pathIndex < path.length; pathIndex++) {
        const key = path[pathIndex]
        if (key === "*") {
          const nextErrors = {}
          const restPath = path.slice(pathIndex + 1)
          if (tempValue) {
          // eslint-disable-next-line no-loop-func
            tempValue.forEach((elem, index) => {
              validate(tempValue, [index, ...restPath], rules, nextErrors)
            })
          }
          if (Object.keys(nextErrors).length > 0) {
            set(path.slice(0, pathIndex), errors, nextErrors)
          }
          return errors
        }
        prevTempValue = tempValue
        tempValue = tempValue ? tempValue[key] : tempValue
      }
      const fieldErrors = rules.reduce((fieldErrors, { name, args }) => {
        const { resolver, message, nullAble } = validators[name]
        if (tempValue || nullAble) {
          const resolverArgs = { value: tempValue, args, formPayload: prevTempValue, totalValue: input, path, validators }
          if (!resolver(resolverArgs)) {
            fieldErrors.push(typeof message === "function" ? message(resolverArgs) : message)
          }
        }
        return fieldErrors
      }, [])
      if (fieldErrors.length > 0) {
        set(path, errors, fieldErrors)
      }
      return errors
    }
    return validate
  }

  validate = (input, rules, validators) => {
    const errors = {}
    const validator = this.validateInput(this.mergeValidators(validators))
    this.parseRule(rules).forEach((fieldRule) => {
      validator(input, ...fieldRule, errors)
    })
    return errors
  }
}
