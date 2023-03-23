import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { ApiContext } from '@/contants'
import { getField, getLoadFunction } from '@/Pages/Search/Pages/rules'
import {
  defaultOperator,
  keyOperators,
  operators,
} from '@/Pages/Search/constans'
import SearchOperatorSelector from '@/Pages/Search/Pages/Components/SearchOperatorSelector'
import { URL_SEARCH_ATTRIBUTES, URL_SEARCH_LIST } from '@/ApiList'
import Form from '@Components/Components/Forms'
import RowInputWrapper from '@/Components/ListTableComponents/RowInputWrapper'
import {
  LoadableSecondaryOverBlueButton,
  SecondaryBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'

const TaskSearch = ({ setSearchState, filter, setFilter, children }) => {
  const api = useContext(ApiContext)
  const [attributes, setAttributes] = useState([])
  const [renderTable, setRenderTable] = useState(false)

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_SEARCH_ATTRIBUTES, {
      type: filter.type,
    })

    setAttributes(data)
  }, [api, filter.type])

  useEffect(loadData, [loadData])

  const fields = useMemo(
    () =>
      attributes.map(
        ({
          dss_attr_label,
          dss_attr_name,
          dss_component_type,
          dss_component_reference,
          dss_reference_attr_label,
          dss_reference_attr,
          dss_default_search_operator,
          multiple,
          range,
          ...attributes
        }) => {
          const loadData = getLoadFunction(api)({
            dss_component_reference,
            dss_reference_attr_label,
            dss_reference_attr,
          })

          const mappedOperators = keyOperators.reduce((acc, operator) => {
            if (attributes[operator]) {
              acc.push(operators[operator])
            }
            return acc
          }, [])

          return {
            ...loadData,
            component: SearchOperatorSelector(dss_component_type)(
              getField(dss_component_type),
            ),
            id: dss_attr_name,
            type: dss_attr_name,
            placeholder: dss_attr_label,
            label: dss_attr_label,
            multiple,
            range,
            operatorOptions: {
              options:
                mappedOperators.length > 0
                  ? mappedOperators
                  : [defaultOperator],
              defaultOption: dss_default_search_operator
                ? operators[dss_default_search_operator].ID
                : defaultOperator.ID,
            },
          }
        },
      ),
    [api, attributes],
  )

  const defaultOperators = useMemo(
    () =>
      fields.reduce((acc, { id, operatorOptions: { defaultOption } = {} }) => {
        acc[id] = defaultOption
        return acc
      }, {}),
    [fields],
  )

  const onSearch = useCallback(async () => {
    const { type, ...filters } = filter
    console.log(type, 'type onSearch')
    const queryItems = Object.entries(filters).reduce(
      (acc, [key, { value, operator }]) => {
        acc.push({
          attr: key,
          operator: operator || defaultOperators[key],
          arguments: [value],
        })
        return acc
      },
      [],
    )

    const { data } = await api.post(URL_SEARCH_LIST, {
      types: [type],
      inVersions: false,
      queryItems,
    })
    setSearchState(data)
    setRenderTable(true)
  }, [api, defaultOperators, filter, setSearchState])

  const onRemove = useCallback(
    () => setFilter({ type: filter.type }),
    [filter.type, setFilter],
  )

  const isSearchDisabled = useMemo(() => {
    const { type, ...keys } = filter
    return Object.keys(keys).length === 0
  }, [filter])

  return (
    <div className="flex  w-full p-6 overflow-hidden">
      {renderTable ? (
        children(() => setRenderTable(false))
      ) : (
        <>
          <Form
            className="w-full grid grid-row-gap-5 h-min mr-4"
            value={filter}
            onInput={setFilter}
            fields={fields}
            inputWrapper={RowInputWrapper}
          />
          <div className="flex flex-col">
            <LoadableSecondaryOverBlueButton
              className="mb-5 w-64"
              onClick={onSearch}
              disabled={isSearchDisabled}
            >
              Искать
            </LoadableSecondaryOverBlueButton>
            <SecondaryBlueButton className="mb-5 w-64" disabled>
              Применить шаблон
            </SecondaryBlueButton>
            <SecondaryBlueButton className="mb-5 w-64" disabled>
              Сохранить шаблон
            </SecondaryBlueButton>
            <SecondaryGreyButton className="mb-5 w-64" onClick={onRemove}>
              Очистить
            </SecondaryGreyButton>
            <SecondaryGreyButton className="mb-5 w-64" disabled>
              Экспорт
            </SecondaryGreyButton>
          </div>
        </>
      )}
    </div>
  )
}

TaskSearch.propTypes = {}

TaskSearch.defaultProps = {}

export default TaskSearch
