// преобразуем объект с апи отчетов в стандартный объект парсера
const attributesAdapter = ({
  dss_component_type,
  multiple,
  dss_attr_label,
  ...attributes
}) => ({
  type: dss_component_type,
  attr: {
    dsb_multiply: multiple,
    dss_placeholder: dss_attr_label,
    dss_attr_label,
    ...attributes,
  },
})

export default attributesAdapter
