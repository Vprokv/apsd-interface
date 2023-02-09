import React from 'react'

export const ApiContext = React.createContext(() => null)
export const TokenContext = React.createContext({
  token: '',
  dropToken: () => null,
})

export const TASK_LIST = 'TASK_LIST'
export const TASK_LIST_ARCHIVE = 'TASK_LIST_ARCHIVE'
export const ITEM_DOCUMENT = 'ITEM_DOCUMENT'
export const ITEM_TASK = 'ITEM_TASK'
export const TASK_ITEM_REQUISITES = 'TASK_ITEM_REQUISITES'
export const TASK_ITEM_HISTORY = 'TASK_ITEM_HISTORY'
export const TASK_ITEM_SUBSCRIPTION = 'TASK_ITEM_SUBSCRIPTION'
export const TASK_ITEM_OBJECTS = 'TASK_ITEM_OBJECTS'
export const TASK_ITEM_STRUCTURE = 'TASK_ITEM_STRUCTURE'
export const TASK_ITEM_APPROVAL_SHEET = 'TASK_ITEM_APPROVAL_SHEET'
export const TASK_ITEM_REMARKS = 'TASK_ITEM_REMARKS'
export const TASK_ITEM_HANDOUTS = 'TASK_ITEM_HANDOUTS'
export const TASK_ITEM_NEW_DOCUMENT = 'TASK_ITEM_NEW_DOCUMENT'
export const TASK_ITEM_CONTENT = 'TASK_ITEM_CONTENT'
export const TASK_ITEM_LINK = 'TASK_ITEM_LINK'
export const SEARCH_PAGE = 'SEARCH_PAGE'
export const INSIDE_DOCUMENT_WINDOW = 'INSIDE_DOCUMENT_WINDOW'
export const ASUD_DOCUMENT_WINDOW = 'ASUD_DOCUMENT_WINDOW'
export const SEARCH_PAGE_TASKS = 'SEARCH_PAGE_TASKS'
export const SIDEBAR_STATE = 'SIDEBAR_STATE'

export const WINDOW_ADD_EMPLOYEE = 'WINDOW_ADD_EMPLOYEE'
export const WINDOW_ADD_OBJECT = 'WINDOW_ADD_OBJECT'
export const WINDOW_ADD_SUBSCRIPTION = 'WINDOW_ADD_SUBSCRIPTION'
export const WINDOW_SHOW_TITLE = 'WINDOW_SHOW_TITLE'

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY HH:mm'
export const DEFAULT_DATE_FORMAT_OTHER = 'HH:mm DD.MM.YYYY'
export const PRESENT_DATE_FORMAT = 'DD.MM.YYYY'

export const DATE_FORMAT_DD_MM_YYYY_HH_mm_ss = 'DD.MM.YYYY HH:mm:ss'

export const DocumentTypeContext = React.createContext(ITEM_DOCUMENT)
