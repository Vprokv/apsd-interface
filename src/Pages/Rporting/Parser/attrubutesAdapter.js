// формируем из аттрибутов бэка объект валидации как в реквизитах, по стандарту парсера
const buildValidationRule = ({ required, requiredIf, requiredWithout }) => {
  const res = []
  if (required) {
    res.push('required')
  }

  if (requiredIf) {
    res.push(requiredIf)
  }

  if (requiredWithout) {
    res.push(requiredWithout)
  }
  return res.join('|') // правила идут через этот разделитель
}
// преобразуем объект с апи отчетов в стандартный объект парсера
const attributesAdapter = ({
  type,
  multiple,
  name,
  label,
  required,
  requiredIf,
  requiredWithout,
  readOnlyRule,
  ...attributes
}) => ({
  type,
  attr: {
    dss_attr_name: name,
    dsb_multiply: multiple,
    dss_attr_label: label,
    dss_readonly_rule: readOnlyRule,
    dss_validation_rule: buildValidationRule({
      required,
      requiredIf,
      requiredWithout,
    }),
    ...attributes,
  },
})

export default attributesAdapter
