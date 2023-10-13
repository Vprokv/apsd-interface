import { useCallback, useMemo } from 'react'

// value DataPicker Разбито в стейте на 2 поля с соовествующими префиксами
const addDataPickerAdapter = () => (fieldState) => () => {
  fieldState.hooks.push(({ formPayload, id, onInput }) => {
    const beforeId = `${id}_before`
    const afterId = `${id}_after`
    // извлекаем значение из формы
    const { [beforeId]: before, [afterId]: after } = formPayload
    return {
      range: true, // делаем датапикер всегда range
      onInput: useCallback(
        ([before, after]) => {
          // всегда отправляем в форму оба значения. т.к. не знаем какое поменялось
          onInput(before, beforeId)
          onInput(after, afterId)
        },
        [afterId, beforeId, onInput],
      ),
      value: useMemo(() => [before, after], [before, after]), // мемоизируем значения для поля
    }
  })
}
export default addDataPickerAdapter
