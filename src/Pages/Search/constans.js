import React from 'react'

export const MultipleContext = React.createContext({
  multiple: false,
  setSelected: () => null,
  selected: [],
})

const OPERATOR_EQ = 'dsb_equals_search_operator'
const OPERATOR_OR = 'dsb_or_search_operator'
const OPERATOR_NOT_EQ = 'dsb_not_equal_search_operator'
const OPERATOR_CONTAINS = 'dsb_contains_search_operator'
const OPERATOR_AND = 'dsb_and_search_operator'
const OPERATOR_STARTS_WITH = 'dsb_starts_with_search_operator'
const OPERATOR_HIDE_LIST_ON_SEARCH = 'dsb_hide_list_on_search'
const OPERATOR_HIGHLIGHT = 'dsb_highlight_on_form'

export const keyOperators = [
  OPERATOR_EQ,
  OPERATOR_OR,
  OPERATOR_NOT_EQ,
  OPERATOR_CONTAINS,
  OPERATOR_AND,
  OPERATOR_STARTS_WITH,
]

export const operators = {
  [OPERATOR_EQ]: { ID: 'EQ', SYS_NAME: 'Равно' },
  [OPERATOR_OR]: { ID: 'OR', SYS_NAME: 'Или' },
  [OPERATOR_NOT_EQ]: {
    ID: 'NOT_EQ',
    SYS_NAME: 'Не равно',
  },
  [OPERATOR_CONTAINS]: {
    ID: 'CONTAINS',
    SYS_NAME: 'Содержит',
  },
  [OPERATOR_AND]: { ID: 'AND', SYS_NAME: 'И' },
  [OPERATOR_STARTS_WITH]: {
    ID: 'STARTS_WITH',
    SYS_NAME: 'Начинается с',
  },
}
export const defaultOperator = operators[OPERATOR_EQ]
