import { URL_ENTITY_LIST } from '@/ApiList'
import getFilters from './FilterStage/controller'
import { useContext, useMemo } from 'react'
import { ApiContext } from '@/contants'

// надстройка над фильтр стейджем. Используеться, когда компонент не содержит в себе функции загрузки данных
const getLoadFunction = (state) => (fieldState) => (config) => {
  const {
    attr: {
      dss_component_reference,
      dss_attr_name,
      dss_reference_attr_label,
      dss_reference_attr,
    },
  } = config

  // если у компонента нету справочника с бэка. значит ему ничего не нужно загружать
  if (dss_component_reference) {
    getFilters(state)(fieldState)(config) // задаем очередность хуков, сначала хуки фильтров,
    // потом мы закидываем свои хуки
    // всегда возвращаем хук, для получения контекста API и фильтров
    fieldState.hooks.push(({ filters }) => {
      const api = useContext(ApiContext)
      return useMemo(
        () => ({
          loadFunction: async (query) => {
            const { data } = await api.post(URL_ENTITY_LIST, {
              id: dss_attr_name,
              type: dss_component_reference,
              query,
              // filter: query
              // ? {
              //     query,
              //   }
              // : {}, //TODO тут непонятно как передавать query корректно, оставила как работает
              filters,
            })
            return data
          },
        }),
        [filters, api],
      )
    })
    fieldState.props.valueKey = dss_reference_attr || 'r_object_id' // Ключ выбираемых данных
    fieldState.props.labelKey = dss_reference_attr_label || 'dss_name' // Ключ отображаемых данных
    fieldState.props.refKey = dss_component_reference // ключ справочника для доступа к кэшу справочников
  }
}

export default getLoadFunction
