import { useContext, useMemo } from 'react'
import { CustomValuesContext } from '../constants'
// извлекаем статичные опции полученные при загрузке объекта документа
const customValuesStage = () => (fieldState) => () => {
  fieldState.hooks.push(({ id, valueKey = 'r_object_id', value, options }) => {
    const customValues = useContext(CustomValuesContext)
    return {
      value: value === null ? undefined : value, // нормализуем значения
      options: useMemo(() => {
        const v = customValues[id]
        return [
          ...(options || []),
          ...(v ? (Array.isArray(v) ? v : [v]) : []).map((v) =>
            typeof v === 'object' ? v : { [valueKey]: v },
          ),
        ]
      }, [customValues, id, valueKey, options]),
    }
  })
}

export default customValuesStage
