import SelfFilter from './Self'
import DependsOnFilter from './DependsOn'

const filtersType = {
  self: SelfFilter,
  depends_on: DependsOnFilter,
}

const getFilters = (state) => (fieldState) => (conf) => {
  const {
    attr: { filters },
  } = conf

  if (filters) {
    filters
      .reduce((acc, filter) => {
        if (!acc.has(filter.type)) {
          acc.set(filter.type, [])
        }
        acc.get(filter.type).push(filter) // группируем фильтры по типу
        return acc
      }, new Map())
      .forEach((filters, type) => {
        // вызываем для каждого типа фильтра контроллер
        if (filtersType[type]) {
          filtersType[type](state)(fieldState)(filters, conf)
        }
      })
  }
}

export default getFilters
