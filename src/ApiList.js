// SYSTEM
export const URL_LOGIN = '/ts/simple/login'
export const URL_USER_OBJECT = '/sedo/employee/bylogin' // {token <String>}
export const URL_SYSTEM_META = '/apsd/system/ui/settings'
export const URL_USER_CHANGE_PASSWORD = '/sedo/user/password'

// TASK
export const URL_TASK_LIST = '/sedo/task/list'
export const URL_TASK_ITEM = '/sedo/document/get'
export const URL_TASK_LIST_V2 = '/sedo/task/list/v2'
export const URL_TASK_LIST_FILTERS = '/apsd/task/filters'
export const URL_TASK_STATISTIC = '/sedo/task/statistic'
export const URL_TASK_PROMOTE = '/sedo/task/promote'
// ITEM
// TITLE CONTAIN
export const URL_TITLE_CONTAIN = '/apsd/structure/list'
export const URL_TITLE_CONTAIN_DEPARTMENT = '/apsd/structure/default'
export const URL_TITLE_CONTAIN_SAVE = '/apsd/structure/save'
export const URL_TITLE_CONTAIN_CREATE = '/apsd/structure/create'
export const URL_TITLE_CONTAIN_DELETE = '/apsd/structure/delete'
// SUBSCRIPTION
export const URL_SUBSCRIPTION_LIST = '/apsd/subscription/list'
export const URL_SUBSCRIPTION_EVENTS = '/apsd/subscription/events'
export const URL_SUBSCRIPTION_CREATE = '/apsd/subscription/create'
export const URL_SUBSCRIPTION_DELETE = '/apsd/subscription/deleted'
export const URL_SUBSCRIPTION_CHANNELS = '/apsd/subscription/channels'
// OBJECTS
export const URL_TECHNICAL_OBJECTS_LIST = '/apsd/title/technical_objects/list'
export const URL_TECHNICAL_OBJECTS_CREATE = '/apsd/title/technical_objects/add'

// HANDOUTS
export const URL_HANDOUTS_LIST = '/apsd/original/accounting/list'
export const URL_HANDOUTS_CREATE = '/apsd/original/accounting/create'

// APPROVAL SHEET
export const URL_APPROVAL_SHEET = '/sedo/approve/stage/get_all'
export const URL_APPROVAL_SHEET_DELETE = '/sedo/approve/stage/delete'
export const URL_APPROVAL_SHEET_CREATE = '/sedo/approve/stage/create'

// DOCUMENT
export const URL_DOCUMENT_CREATION_OPTIONS = '/sedo/classification'
export const URL_DOCUMENT_APSD_CREATION_OPTIONS = '/apsd/classification'
export const URL_DOCUMENT_VIEWED = '/sedo/document/list/recently_viewed'
export const URL_DOCUMENT_CLASSIFICATION =
  '/sedo/document/create/from_classification'
export const URL_DOCUMENT_CREATE = '/sedo/document/create'
export const URL_DOCUMENT_UPDATE = '/sedo/document/update'

// LINK
export const URL_LINK_LIST = '/apsd/link/list'
export const URL_LINK_CREATE = '/apsd/link/create'
export const URL_LINK_DELETE = '/apsd/link/delete'
export const URL_LINK_UPDATE = '/apsd/link/update'

// ENTITY
export const URL_ENTITY_LIST = '/sedo/entity/list'

// EMPLOYEE
export const URL_EMPLOYEE_LIST = '/sedo/employee/query'

export const URL_ORGSTURCTURE_ORGANIZATIONS = '/sedo/orgstructure/organizations'
export const URL_ORGSTURCTURE_BRANCHES = '/sedo/orgstructure/branches'
export const URL_ORGSTURCTURE_DEPARTMENTS = '/sedo/orgstructure/departments'

// STORAGE
export const URL_STORAGE_BRANCH = 'apsd/archive/branch'
export const URL_STORAGE_TITLE = 'apsd/archive/title'
export const URL_STORAGE_DOCUMENT = 'apsd/archive/list'
export const URL_STORAGE_SECTION = '/apsd/archive/section'

// CONTENT
export const URL_CONTENT_LIST = '/apsd/content/list/version'
export const URL_CREATE_VERSION = '/apsd/content/create/version'
export const URL_UPDATE_VERSION = '/apsd/content/update/version'
export const URL_DELETE_VERSION = '/apsd/content/delete/version'
export const URL_UPLOAD_FILE_VERSION = '/sedo/content/uploadfiles'

export const URL_CONTENT_SEARCH = '/sedo/content/eehd/search'
export const URL_LINK_CREATE_RELATION = '/sedo/content/eehd/create'
