import { readOnlyRules } from './rules'
import { disabledStage } from '@/Utils/Parser/Stages/DisabledStage'

const parseReadOnlyRule = (state) => {
  const addDisabledRule = disabledStage(state) // инициализируем disabled проверки для полей

  return ({ attr: { dss_readonly_rule, dss_attr_name } }) => {
    if (dss_readonly_rule) {
      const [rule, id, values] = dss_readonly_rule.match(/[^:,]+/gm)
      // добавляем условие для поля в dss_attr_name
      addDisabledRule(
        dss_attr_name,
        // создаем функцию проверки состояние disabled поля
        new Function('obj = {}', `return ${readOnlyRules[rule](id, values)}`),
      )
    }
  }
}

export default parseReadOnlyRule
