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
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'

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
            dss_reference_attr_label,
            dss_reference_attr,
            dss_component_reference,
            // multiple,
            range,
          },
        ) => {
          const loadData = getLoadFunction(api)({
            dss_component_reference,
            dss_reference_attr_label,
            dss_reference_attr,
          })

          acc.push({
            ...loadData,
            component: getField(dss_component_type),
            id: dss_attr_name,
            placeholder: dss_attr_label,
            label: dss_attr_label,
            multiple: false,
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
      inputWrapper={InputWrapper}
      value={filter}
      onInput={onInput}
    />
  )
}

SearchFields.propTypes = {}

export default SearchFields
