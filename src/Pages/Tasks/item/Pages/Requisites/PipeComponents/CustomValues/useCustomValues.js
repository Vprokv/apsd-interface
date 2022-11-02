import { useContext, useMemo } from 'react'
import { CustomValuesContext } from '../../constants'

const useCustomValues = ({ id, valueKey, value }) => {
  const customValues = useContext(CustomValuesContext)
  return {
    value: value === null ? undefined : value,
    options: useMemo(() => {
      const v = customValues[id]
      return (v ? (Array.isArray(v) ? v : [v]) : []).map((v) =>
        typeof v === 'object' ? v : { [valueKey]: v },
      )
    }, [customValues, id, valueKey]),
  }
}

export default useCustomValues
