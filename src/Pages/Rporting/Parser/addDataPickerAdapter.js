import { useCallback, useMemo } from 'react'

// value DataPicker Разбито в стейте на 2 поля с соовествующими префиксами
const addDataPickerAdapter = () => (fieldState) => () => {
  fieldState.hooks.push(({ id, onInput, value = {} }) => {
    const beforeId = `${id}_before`
    const afterId = `${id}_after`
    // извлекаем значение из формы
    const { [beforeId]: before, [afterId]: after } = value
    return {
      range: true, // делаем датапикер всегда range
      onInput: useCallback(
        ([before, after]) => {
          // отправляем объект с динамическими ключами
          onInput({ [beforeId]: before, [afterId]: after }, id)
        },
        [afterId, beforeId, id, onInput],
      ),
      value: useMemo(() => [before, after], [before, after]), // мемоизируем значения для поля
    }
  })
}
export default addDataPickerAdapter
