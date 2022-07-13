import React from "react";

export const ApiContext = React.createContext(() => null)

export const TASK_LIST = "TASK_LIST"
export const TASK_ITEM_DOCUMENT = "TASK_ITEM_DOCUMENT"
export const TASK_ITEM_REQUISITES = "TASK_ITEM_REQUISITES"


export const DEFAULT_DATE_FORMAT = "DD.MM.YYYY HH:mm"
export const PRESENT_DATE_FORMAT = "DD.MM.YYYY"