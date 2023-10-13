import { useCallback, useMemo } from 'react'

// value Orgstructure имеет 2 стейта - 1 сереализуемый, для отправки в пост запрос
// второй нет, для использования в селекте
const addDataPickerAdapter = () => (fieldState) => () => {
  // TODO: res_author нигде не используется, возможно необходимо удалить
  fieldState.hooks.push(({ formPayload, id, onInput, res_author }) => {
    const enumerableStateId = useMemo(() => Symbol(id), [id]) // генерируем несереализуемый ключ
    return {
      returnObjects: true, // селект должен возвращать объекты всегда
      onInput: useCallback(
        (value = []) => {
          onInput(value, enumerableStateId) // отправляем данные как есть по несереализуемуемому ключу
          // отправляем данные по стандартному id, доступными для отправки на бэк
          onInput(
            value.map(({ emplId, fullDescription, userName }) => ({
              [res_author ? 'res_author_label' : `${id}_label`]:
                fullDescription,
              [res_author ? 'res_author_dss_user_name' : `${id}_dss_user_name`]:
                userName,
              [res_author ? 'res_author' : 'emplId']: emplId,
            })),
            id,
          )
        },
        [enumerableStateId, id, onInput, res_author],
      ),
      value: formPayload[enumerableStateId], // в селект прокидываем данные как есть по несереализуемому ключу
    }
  })
}
export default addDataPickerAdapter
