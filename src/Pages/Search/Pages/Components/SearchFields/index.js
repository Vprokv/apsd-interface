import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { FilterForm } from './styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { getField, getLoadFunction } from '@/Pages/Search/Pages/rules'
import { ApiContext } from '@/contants'
import { TabStateContext } from '@/Pages/Search/Pages/constans'

const SearchFields = () => {
  const {
    tabState: { data = [], filter = {} },
  } = useContext(TabStateContext)

  const api = useContext(ApiContext)
  // const [filter, setFilter] = useState({})
  const { setTabState } = useContext(TabStateContext)

  const onInput = useCallback(
    (val) => {
      const prevFilter = { ...filter }
      setTabState({ filter: { ...prevFilter, ...val } })
    },
    [filter, setTabState],
  )

  const parseDesign = useMemo(
    () =>
      data.reduce(
        (
          acc,
          {
            dss_attr_label,
            dss_attr_name,
            dss_component_type,
            dss_component_reference,
            dss_default_search_operator,
            dsb_equals_search_operator,
            dsb_or_search_operator,
            dsb_not_equal_search_operator,
            dsb_contains_search_operator,
            dsb_and_search_operator,
            dsb_starts_with_search_operator,
            multiple,
            range,
          },
        ) => {
          const loadData = getLoadFunction(api)(dss_component_reference)

          acc.push({
            ...loadData,
            component: getField(dss_component_type),
            id: dss_attr_name,
            placeholder: dss_attr_label,
            multiple,
            range,
          })

          return acc
        },
        [],
      ),
    [api, data],
  )

  return (
    <FilterForm
      fields={parseDesign}
      inputWrapper={EmptyInputWrapper}
      value={filter}
      onInput={onInput}
    />
  )
}

SearchFields.propTypes = {}

export default SearchFields
