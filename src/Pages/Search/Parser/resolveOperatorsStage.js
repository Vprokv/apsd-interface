import {
  defaultOperator,
  keyOperators,
  operators,
} from '@/Pages/Search/constans'
import { OperatorContainer } from '@/Pages/Search/Pages/Components/SearchOperatorSelector/styles'
import { Select } from '@/Components/Inputs/Select'
import { forwardRef, useCallback, useMemo } from 'react'

const resolveOperatorsStage = () => (fieldState) => (args) => {
  const {
    type,
    attr,
    attr: { dss_default_search_operator },
  } = args
  // ищем в конфиге информацию о операторах поиска
  const mappedOperators = keyOperators.reduce((acc, operator) => {
    if (attr[operator]) {
      acc.push(operators[operator])
    }
    return acc
  }, [])

  console.log(type, 'type')
  console.log(dss_default_search_operator, 'default')
  console.log(mappedOperators, 'mappedOperators')

  // нормализуем список операторов доступных полю
  const options =
    mappedOperators.length > 0 ? mappedOperators : [defaultOperator]

  // нормализуем оператор по умолчанию
  const defaultOption = dss_default_search_operator
    ? operators[dss_default_search_operator].ID
    : defaultOperator.ID

  // определяем по типу поля доступен ли выбор оператора, выдаем соотвествующий декоратор
  const decorator = (Component) =>
    forwardRef(
      mappedOperators.length > 0
        ? (
            {
              className,
              style,
              value: { operator = defaultOption, value } = {},
              ...props
            },
            ref,
          ) => {
            return (
              <OperatorContainer className={className} style={style}>
                <Component
                  ref={ref}
                  {...props}
                  className="mr-4"
                  id="value"
                  value={value}
                />
                <Select
                  className="w-60 flex-0"
                  id="operator"
                  value={operator}
                  options={options}
                  onInput={props.onInput}
                  clearable={false}
                  valueKey="ID"
                  labelKey="SYS_NAME"
                />
              </OperatorContainer>
            )
          }
        : ({ className, style, value: { value } = {}, ...props }, ref) => (
            <OperatorContainer className={className} style={style}>
              <Component
                {...props}
                ref={ref}
                value={value}
                className="mr-4"
                id="value"
              />
            </OperatorContainer>
          ),
    )
  fieldState.hooks.push(({ onInput, id, value, component }) => ({
    // функция поиска работает с операторами, переопределяем функцию инпута, для формирования объекта { value, operator}
    // где value - значение поля из конфига, operator - значение условия поиска
    onInput: useCallback(
      (fieldValue, fieldId) => {
        onInput(
          // по умолчанию замешиваем оператор, чтобы он инициализировался при выборе любого значения
          // закидываем тип поля для парсера
          { operator: defaultOption, type, ...value, [fieldId]: fieldValue },
          id,
        )
      },
      [value, id, onInput],
    ),
    component: useMemo(() => decorator(component), [component]), // заворачиваем компонент в декоратор
  }))
}

export default resolveOperatorsStage
