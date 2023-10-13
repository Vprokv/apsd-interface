import { URL_REPORTS_DEPARTMENT } from '@/ApiList'
import getFilters from '@/Utils/Parser/Stages/parseFieldProps/Stages/FilterStage'
import { useContext, useMemo } from 'react'
import { ApiContext } from '@/contants'

// надстройка над фильтр стейджем. Используеться, когда компонент не содержит в себе функции загрузки данных
const getLoadFunction = (state) => (fieldState) => (config) => {
  getFilters(state)(fieldState)(config) // задаем очередность хуков, сначала хуки фильтров,
  // потом мы закидываем свои хуки
  // всегда возвращаем хук, для получения контекста API и фильтров
  fieldState.hooks.push(({ filters }) => {
    const api = useContext(ApiContext)
    return useMemo(
      () => ({
        loadFunction: async (query, { source, controller } = {}) => {
          const {
            data: { content },
          } = await api.post(
            URL_REPORTS_DEPARTMENT,
            {
              query,
              type: 'branch_list',
              filter: {
                ...filters,
                query,
                useAllFilter: true,
              },
            },
            {
              cancelToken: source?.token,
              signal: controller?.signal,
            },
          )
          return content
        },
      }),
      [filters, api],
    )
  })
  fieldState.props.valueKey = 'dsid_departmen' // Ключ выбираемых данных
  fieldState.props.labelKey = 'dss_department_name' // Ключ отображаемых данных
}

export default getLoadFunction
