import { useMemo } from 'react'
// парсер, работает с полями, values требуются для рантаймовых пропсов формы, stages - плагины для подготовки полей
const useParseConfig = ({ value = {}, stages, fieldsDesign = [] }) => {
  const { fields, formProps, formPropsHooks } = useMemo(() => {
    const initStageState = {
      fields: new Map(), // поля в формате мап, для удобной работы в рантайме
      formProps: {}, // статичные пропсы формы
      formPropsHooks: [], // динамические пропсы формы, зависящие от значений полей
    }
    const initializedStages = stages.map((s) => s(initStageState)) // рантаймовые хуки требуют инициализации состояний
    fieldsDesign.forEach((config) => {
      initializedStages.forEach((s) => s(config)) // прогоняем каждое поле через пайплайн плагинов
    })
    return initStageState
  }, [fieldsDesign, stages])

  // расчитываем все хуки, каждый хук отвечает за оптимизацию рендеров сам
  const { fields: rtFields, formProps: rtFormProps } = formPropsHooks.reduce(
    (acc, h) => ({ ...acc, ...h(acc) }),
    {
      fields,
      value,
    },
  )

  // мержим пропсы, рантаймовые пропсы заменяют статичные
  return useMemo(
    () => ({
      ...rtFormProps,
      ...formProps,
      fields: Array.from(rtFields.values()),
    }),
    [rtFields, formProps, rtFormProps],
  )
}

export default useParseConfig
