import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import Select from '@Components/Components/Inputs/Select'

const operators = {
  dsb_equals_search_operator: { ID: 'EQ', SYS_NAME: 'Равно' },
  dsb_or_search_operator: { ID: 'OR', SYS_NAME: 'Или' },
  dsb_not_equal_search_operator: {
    ID: 'NOT_EQ',
    SYS_NAME: 'Не равно',
  },
  dsb_contains_search_operator: {
    ID: 'CONTAINS',
    SYS_NAME: 'Содержит',
  },
  dsb_and_search_operator: { ID: 'AND', SYS_NAME: 'И' },
  dsb_starts_with_search_operator: {
    ID: 'STARTS_WITH',
    SYS_NAME: 'Начинается с',
  },
}

const keyOperators = [
  'dsb_equals_search_operator',
  'dsb_or_search_operator',
  'dsb_not_equal_search_operator',
  'dsb_contains_search_operator',
  'dsb_and_search_operator',
  'dsb_starts_with_search_operator',
]

const SearchOperator = () => {
  const {
    tabState: { data = [] },
    operator = new Map(),
    setOperator = () => null,
  } = useContext(TabStateContext)

  const onInput = useCallback(
    (key) => (val) => {
      const prevChecked = new Map(operator)
      return setOperator(prevChecked.set(key, val))
    },
    [operator, setOperator],
  )

  const selects = useMemo(
    () =>
      data.map(({ dss_attr_name, ...item }) => {
        const options = keyOperators.reduce((acc, val) => {
          if (item[val]) {
            acc.push(operators[val])
          }

          return acc
        }, [])

        return (
          <Select
            value={
              operator.has(dss_attr_name)
                ? operator.get(dss_attr_name)
                : onInput(dss_attr_name)(
                    operators[[item['dss_default_search_operator']]],
                  )
            }
            options={options}
            className="mr-4 mb-5"
            onInput={onInput(dss_attr_name)}
            key={dss_attr_name}
          />
        )
      }),
    [data, onInput, operator],
  )

  return <div className="w-60 flex flex-col">{selects}</div>
}

SearchOperator.propTypes = {}

export default SearchOperator
