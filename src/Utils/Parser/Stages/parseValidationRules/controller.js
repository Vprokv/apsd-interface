import validationRules from './rules'

const parseValidationRules = (state) => {
  // правила валидации -  пропс формы, записываем туда объект
  state.formProps.rules = {}
  return ({ attr: { dss_validation_rule, dss_attr_name } }) => {
    // конфиг правил валидации с бэка
    if (dss_validation_rule) {
      // складываем правила валидации по ключу поля
      state.formProps.rules[dss_attr_name] = dss_validation_rule
        .split('|') // правила валидации и параметры к ним приходят через разделитель
        // собираем массив правил валидации
        .map((rule) => {
          const [ruleName, ...args] = rule.startsWith('regex') // парсим правило валидации
            ? rule.split(':')
            : rule.startsWith('{')
            ? rule.split()
            : rule.split(/([,:])/gm)

          const {
            [ruleName]: validationRule = validationRules.defaultForJson,
          } = validationRules
          return validationRule(...args, ruleName) // возвращаем правило валидации
        })
    }
  }
}

export default parseValidationRules
