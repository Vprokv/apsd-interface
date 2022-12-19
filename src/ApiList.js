// SYSTEM
export const URL_LOGIN = '/ts/simple/login'
export const URL_USER_OBJECT = '/sedo/employee/bylogin' // {token <String>}
export const URL_SYSTEM_META = '/apsd/system/ui/settings'
export const URL_USER_CHANGE_PASSWORD = '/sedo/user/password'

// TASK
export const URL_TASK_LIST = '/sedo/task/list'
export const URL_DOCUMENT_ITEM = '/sedo/document/get'
export const URL_TASK_ITEM = '/sedo/task/get'
export const URL_TASK_COMPLETE = '/sedo/task/complete'
export const URL_TASK_MARK_READ = '/sedo/task/mark_read'
export const URL_TASK_LIST_V2 = '/sedo/task/list/v2'
export const URL_TASK_LIST_FILTERS = '/sedo/task/filter/existing'
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
export const URL_APPROVAL_SHEET_CREATE_AND_START =
  '/sedo/approve/additional/create_and_start'
export const URL_APPROVAL_CREATE = '/sedo/approve/approvers/create'

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

// REMARK
export const URL_REMARK_LIST = '/apsd/remark/list'
export const URL_REMARK_CREATE = '/apsd/remark/create'
export const URL_REMARK_DELETE = '/apsd/remark/delete'
export const URL_REMARK_ANSWER = '/apsd/remark/answer'
export const URL_REMARK_UPDATE = '/apsd/remark/update'
export const URL_REMARK_PERMIT = '/apsd/remark/permit'

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
export const URL_CONTENT_SEND_EEHD = '/apsd/content/send/eehd'
export const URL_CREATE_VERSION = '/apsd/content/create/version'
export const URL_UPDATE_VERSION = '/apsd/content/update/version'
export const URL_DELETE_VERSION = '/apsd/content/delete/version'
export const URL_UPLOAD_FILE_VERSION = '/sedo/content/uploadfiles'

export const URL_CONTENT_SEARCH = '/sedo/content/eehd/search'
export const URL_LINK_CREATE_RELATION = '/sedo/content/eehd/create'

// SEARCH
export const URL_SEARCH_ATTRIBUTES = '/apsd/search/attributes'
export const URL_TYPE_CONFIG = '/apsd/type/config'
export const URL_SEARCH_LIST = '/apsd/search?limit=101&offset=0'

// INTEGRATION
export const URL_INTEGRATION_SEND_LETTER = '/apsd/integration/send/letter'
export const URL_BUSINESS_DOCUMENT_RECALL = '/apsd/business/document/recall'

export const URL_PREVIEW_VERSION = 'preview/pdf/ddt_apsd_content_version'
export const URL_PREVIEW_DOCUMENT = 'preview/pdf/ddt_document_content'

// DOWNLOAD
export const URL_DOWNLOAD_FILE = '/sedo/entity/getcontent'

// Preview

export const URL_ENTITY_PDF_FILE = 'preview/pdf/'
