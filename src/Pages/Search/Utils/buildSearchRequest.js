const defaultQueryParser =
  (query) =>
  ({ value, operator, key }) => {
    value &&
      query.push({
        attr: key,
        operator,
        arguments: [value],
      })
  }

const dateQueryBuilder =
  (query) =>
  ({ value: [before, after], key }) => {
    // даты помещаем в начало очереди.
    // Вставляем в обратном порядке, чтобы в итоговом результате "от" была на первом месте. "до" на втором
    after &&
      query.unshift({
        attr: key,
        operator: 'LTE',
        arguments: [`${after} 23:59:59`],
      })
    before &&
      query.unshift({
        attr: key,
        operator: 'GTE',
        arguments: [`${before} 00:00:00`],
      })
  }

const queryWrapperBuilderByType = {
  Date: dateQueryBuilder,
}

const buildSearchQuery = (filterFormValue) =>
  // преобразуем объект value формы в массив
  Object.entries(filterFormValue).reduce(
    // value - содержимое поиска, operator - условие поиска, type - тип поля.
    // operator и type автоматический инициализируются в parser модулем resolveOperatorStage
    (acc, [key, { value, operator, type }]) => {
      // определяем функцию билдера по типу поля
      const { [type]: rulePars = defaultQueryParser } =
        queryWrapperBuilderByType
      // билдеры сами определяют вставки в итоговый массив
      rulePars(acc)({ key, value, operator })
      return acc
    },
    [],
  )

export default buildSearchQuery
