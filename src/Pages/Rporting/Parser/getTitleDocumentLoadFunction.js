import { URL_TITLE_LIST } from '@/ApiList'
import getFilters from '@/Utils/Parser/Stages/parseFieldProps/Stages/FilterStage'
import { useContext, useMemo } from 'react'
import { ApiContext } from '@/contants'

// надстройка над фильтр стейджем. Используеться, когда компонент не содержит в себе функции загрузки данных
const getLoadFunction = (state) => (fieldState) => (config) => {
  getFilters(state)(fieldState)(config) // задаем очередность хуков, сначала хуки фильтров,
  // потом мы закидываем свои хуки
  // всегда возвращаем хук, для получения контекста API и фильтров
  fieldState.hooks.push(({ filter }) => {
    const api = useContext(ApiContext)
    return useMemo(
      () => ({
        loadFunction: async (query, { source, controller } = {}) => {
          const { data } = await api.post(
            URL_TITLE_LIST,
            {
              query,
              ...filter,
            },
            {
              cancelToken: source?.token,
              signal: controller?.signal,
            },
          )
          return data
        },
      }),
      [filter, api],
    )
  })
  fieldState.props.valueKey = 'id' // Ключ выбираемых данных
  fieldState.props.labelKey = 'description' // Ключ отображаемых данных
}

export default getLoadFunction
