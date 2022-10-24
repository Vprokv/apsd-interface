import React from 'react'

export const ApiContext = React.createContext(() => null)

export const TASK_LIST = 'TASK_LIST'
export const TASK_LIST_ARCHIVE = 'TASK_LIST_ARCHIVE'
export const TASK_ITEM_DOCUMENT = 'TASK_ITEM_DOCUMENT'
export const TASK_ITEM_REQUISITES = 'TASK_ITEM_REQUISITES'
export const TASK_ITEM_HISTORY = 'TASK_ITEM_HISTORY'
export const TASK_ITEM_SUBSCRIPTION = 'TASK_ITEM_SUBSCRIPTION'
export const TASK_ITEM_OBJECTS = 'TASK_ITEM_OBJECTS'
export const TASK_ITEM_STRUCTURE = 'TASK_ITEM_STRUCTURE'
export const TASK_ITEM_NEW_DOCUMENT = 'TASK_ITEM_NEW_DOCUMENT'

export const WINDOW_ADD_EMPLOYEE = 'WINDOW_ADD_EMPLOYEE'
export const WINDOW_ADD_OBJECT = 'WINDOW_ADD_OBJECT'
export const WINDOW_ADD_SUBSCRIPTION = 'WINDOW_ADD_SUBSCRIPTION'

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY HH:mm'
export const PRESENT_DATE_FORMAT = 'DD.MM.YYYY'

export const DATE_FORMAT_DD_MM_YYYY_HH_mm_ss = 'DD.MM.YYYY HH:mm:ss'
export const DATE_FORMAT_YYYY_escape = 'YYYY-MM-DDTHH:mm:ssZ[Z]'

export const DocumentTypeContext = React.createContext(TASK_ITEM_DOCUMENT)
