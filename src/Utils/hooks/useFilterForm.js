import { useCallback, useMemo, useState } from 'react'
import debounce from 'lodash/debounce'

export const useFilterForm = (filter, setFilter) => {
  const onUpdateFilterTabState = useMemo(
    () => debounce((filter) => setFilter({ filter }), 500),
    [setFilter],
  )

  const [filterState, setFilterState] = useState(filter)

  const onFilterInput = useCallback(
    (filter) => {
      setFilterState(filter)
      onUpdateFilterTabState(filter)
    },
    [onUpdateFilterTabState],
  )

  return [filterState, onFilterInput]
}
