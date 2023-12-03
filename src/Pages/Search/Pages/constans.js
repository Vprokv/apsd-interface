import React from 'react'

const CREATION_DATE = 'dsdt_creation_date'
const EXECUTE_DATE = 'dsdt_execute_date'
const DUE_DATE = 'dsdt_due_date'

export const rangeComponent = {
  [CREATION_DATE]: true,
  [EXECUTE_DATE]: true,
  [DUE_DATE]: true,
}

export const ExportContext = React.createContext(() => null)

const COMBOBOX_COMPONENT = 'Combobox'
const ORGSTRUCTURE_COMPONENT = 'Orgstructure'
const USER_SELECT_COMPONENT = 'UserSelect'
const DATE_COMPONENT = 'Date'
const CHECKBOX = 'Checkbox'
// const TAG_COMPONENT = 'ddt_document_tag'

export const operatorsComponent = {
  [COMBOBOX_COMPONENT]: true,
  [ORGSTRUCTURE_COMPONENT]: true,
  [USER_SELECT_COMPONENT]: true,
  [DATE_COMPONENT]: true,
  [CHECKBOX]: true,
  // [TAG_COMPONENT]: true,
}
