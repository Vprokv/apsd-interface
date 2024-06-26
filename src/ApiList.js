// SYSTEM
export const URL_LOGIN = '/ts/simple/login'
export const URL_USER_OBJECT = '/sedo/employee/bylogin' // {token <String>}
export const URL_USER_CHANGE_PASSWORD = '/sedo/user/password'
export const URL_USER_PASSWORD_RULES = '/sedo/user/password_policy'

// setting
export const URL_SYSTEM_META = '/settings.json'
export const URL_REVISION_APSD = '/apsd/revision'
export const URL_REVISION_CHAT = '/ts/revision'
export const URL_REVISION_SEDO = '/sedo/revision'
export const URL_COLUMN_SETTINGS_GET = '/sedo/pref/get'
export const URL_COLUMN_SETTINGS_UPDATE = '/sedo/pref/create_or_update'

// TASK
export const URL_TASK_LIST = '/sedo/task/list'
export const URL_TASK_LIST_BY_DOCUMENT = '/apsd/task/v2/document'
export const URL_DOCUMENT_ITEM = '/sedo/document/get'
export const URL_TASK_ITEM = '/apsd/task/v2/get'
export const URL_TASK_COMPLETE = '/sedo/task/complete'
export const URL_TASK_MARK_READ = '/sedo/task/mark_read'
export const URL_TASK_LIST_V2 = '/apsd/task/v2/list'
export const URL_TASK_LIST_FILTERS = '/apsd/task/v2/filter'
export const URL_TASK_STATISTIC = '/sedo/task/statistic'
export const URL_TASK_PROMOTE = '/sedo/task/promote'
export const URL_TITLE_CHECK_DOUBLE = 'apsd/title/check_for_double'

// ITEM
// TITLE CONTAIN
export const URL_TITLE_CONTAIN = '/apsd/structure/list'
export const URL_TITLE_CONTAIN_DEPARTMENT = '/apsd/structure/default'
export const URL_TITLE_CONTAIN_SAVE = '/apsd/structure/save'
export const URL_TITLE_CONTAIN_CREATE = '/apsd/structure/create'
export const URL_TITLE_CONTAIN_UPDATE = '/apsd/structure/document/tom/update'
export const URL_TITLE_CONTAIN_DELETE = '/apsd/structure/delete'
export const URL_TITLE_CONTAIN_CREATE_LINK = '/apsd/structure/link'
export const URL_STURCTURE_SEND = '/apsd/structure/send'
export const URL_TITLE_CONTAIN_CREATE_APPROVE = '/apsd/structure/approve'
export const URL_TITLE_CONTAIN_ANNULMENT = 'apsd/structure/document/annulment'

// SUBSCRIPTION
export const URL_SUBSCRIPTION_LIST = '/apsd/subscription/list'
export const URL_SUBSCRIPTION_EVENTS = '/apsd/subscription/events'
export const URL_SUBSCRIPTION_CREATE = '/apsd/subscription/create'
export const URL_SUBSCRIPTION_DELETE = '/apsd/subscription/deleted'
export const URL_SUBSCRIPTION_CHANNELS = '/apsd/subscription/channels'
export const URL_SUBSCRIPTION_NOTIFICATION_DELETE =
  '/apsd/subscription/user/notifications/delete'
export const URL_SUBSCRIPTION_NOTIFICATION_DELETE_ALL =
  '/apsd/subscription/user/notifications/delete/all'
export const URL_SUBSCRIPTION_NOTIFICATION_WATCH =
  '/apsd/subscription/user/notifications/watch'
// SUBSCRIPTION USER
export const URL_SUBSCRIPTION_NOTIFICATION_LIST =
  '/apsd/subscription/user/notifications'
export const URL_SUBSCRIPTION_USER_CHANNELS = '/apsd/subscription/user/list'
export const URL_SUBSCRIPTION_USER_CREATE = '/apsd/subscription/user/create'
export const URL_SUBSCRIPTION_USER_TOTAL =
  'apsd/subscription/user/notifications/total'
export const URL_SUBSCRIPTION_USER_DELETE =
  '/apsd/subscription/user/event/delete'
// OBJECTS
export const URL_TECHNICAL_OBJECTS_LIST = '/apsd/title/technical_objects/list'
export const URL_TECHNICAL_OBJECTS_DICT = '/apsd/title/technical_objects/dict'
export const URL_TECHNICAL_OBJECTS_ADD = '/apsd/title/technical_objects/add'
export const URL_TECHNICAL_OBJECTS_CREATE =
  '/apsd/title/technical_objects/create'
export const URL_TECHNICAL_OBJECTS_UPDATE =
  '/apsd/title/technical_objects/update'
export const URL_TECHNICAL_OBJECTS_DROP = '/apsd/title/technical_objects/drop'
export const URL_TECHNICAL_OBJECTS_DELETE =
  '/apsd/title/technical_objects/delete'
export const URL_TITLE_LIST = '/apsd/title/list'

// HANDOUTS
export const URL_HANDOUTS_LIST = '/apsd/original/accounting/list'
export const URL_HANDOUTS_CREATE = '/apsd/original/accounting/create'

// APPROVAL SHEET
export const URL_APPROVAL_SHEET = '/apsd/business/stage/all'
export const URL_APPROVAL_SHEET_DELETE = '/apsd/business/stage/delete'
export const URL_APPROVAL_SHEET_CREATE = '/apsd/business/stage/create'
export const URL_APPROVAL_SHEET_UPDATE = '/apsd/business/stage/update'
export const URL_APPROVAL_SHEET_CREATE_AND_START =
  '/sedo/approve/additional/create_and_start'
export const URL_APPROVAL_CREATE = '/apsd/approve/v2/create'
export const URL_APPROVAL_SHEET_CREATE_ADDITIONAL_AGREEMENT =
  '/apsd/business/start/additional'
export const URL_APPROVAL_SHEET_APPROVER_DELETE = '/apsd/approve/v2/delete'
export const URL_APPROVAL_SHEET_CREATE_ADDITIONAL_SEND =
  '/apsd/business/additional/send'
export const URL_APPROVAL_SHEET_CREATE_ADDITIONAL_REVOKE =
  '/apsd/business/additional/revoke'
export const URL_ADDITIONAL_AGREEMENT_USER_LIST = '/apsd/business/approve/empl'
export const URL_ADDITIONAL_AGREEMENT_STAGE_MOVE = '/apsd/business/stage/move'

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

// export const URL_LINK_VIEWED_LIST = '/apsd/task/v2/list/recently'
export const URL_LINK_VIEWED_LIST = '/apsd/document/recently/list'
export const URL_LINK_USER_LIST = '/apsd/link/list/filters'

// REMARK
export const URL_REMARK_LIST = '/apsd/remark/list'
export const URL_REMARK_CREATE = '/apsd/remark/create'
export const URL_REMARK_DELETE = '/apsd/remark/delete'
export const URL_REMARK_ANSWER = '/apsd/remark/answer'
export const URL_REMARK_UPDATE = '/apsd/remark/update'
export const URL_REMARK_PERMIT = '/apsd/remark/permit'
export const URL_REMARK_EDIT_SET_REMARK = '/apsd/remark/edit/vault'

// LIFE CYCLE HISTORY
export const URL_HISTORY_LIST = '/apsd/history/list'
export const URL_HISTORY_LIST_FILTER = '/apsd/history/list/filters'

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

// KNOWLEDGE
export const URL_KNOWLEDGE_STRUCTURE = '/apsd/storage/structure'
export const URL_KNOWLEDGE_TASKS = '/apsd/storage/tasks'
export const URL_KNOWLEDGE_TITLE = '/apsd/storage/title'

// CONTENT
export const URL_CONTENT_LIST = '/apsd/content/list/version'
export const URL_CONTENT_SEND_EEHD = '/apsd/content/send/eehd'
export const URL_CREATE_VERSION = '/apsd/content/create/version'
export const URL_UPDATE_VERSION = '/apsd/content/update/version'
export const URL_DELETE_VERSION = '/apsd/content/delete/version'
export const URL_UPLOAD_FILE_VERSION = '/sedo/content/uploadfiles'
export const URL_CONTENT_PERMIT = '/apsd/content/create/version/permit'

export const URL_CONTENT_SEARCH = '/sedo/content/eehd/search'
export const URL_LINK_CREATE_RELATION = '/sedo/content/eehd/create'

// SEARCH
export const URL_SEARCH_ATTRIBUTES = '/apsd/search/attributes'
export const URL_TYPE_CONFIG = '/apsd/type/config'
export const URL_SEARCH_LIST = '/apsd/search'

// INTEGRATION
export const URL_INTEGRATION_SEND_LETTER = '/apsd/integration/tom/letter/send'
export const URL_BUSINESS_DOCUMENT_RECALL = '/apsd/business/document/recall'
export const URL_BUSINESS_PERMIT = '/apsd/business/permit'
export const URL_BUSINESS_DOCUMENT_STAGES = '/apsd/business/document/stages'
export const URL_BUSINESS_DOCUMENT_RECALL_FOR_REVISION =
  '/apsd/business/document/recall/revision'
export const URL_BUSINESS_DOCUMENT_STAGE_CHANGE =
  'apsd/business/document/stage/change'
export const URL_BUSINESS_DOCUMENT_CANCEL = '/apsd/business/document/cancel'
export const URL_BUSINESS_DOCUMENT_ROUTE_CHANGE =
  'apsd/business/document/rout/change'

export const URL_PREVIEW_VERSION = 'preview/pdf/ddt_apsd_content_version'
export const URL_PREVIEW_DOCUMENT = 'preview/pdf/ddt_document_content'

// DOWNLOAD
export const URL_DOWNLOAD_FILE = '/sedo/entity/getcontent'
export const URL_DOWNLOAD_GET_FILE = '/sedo/entity/file'
export const URL_DOWNLOAD_CONTENT = '/apsd/document/export/queue/archive'
export const URL_INTEGRATION_TOM_DOWNLOAD =
  '/apsd/integration/tom/letter/template/download'

// PREVIEW
export const URL_ENTITY_PDF_FILE = '/preview/pdf/'

// TEMPLATE
export const URL_TEMPLATE_LIST = '/sedo/template/list'
export const URL_TEMPLATE = '/sedo/template/get'
export const URL_CREATE_STAGE = '/sedo/approve/template'
export const URL_CREATE_TEMPLATE = '/sedo/template/create'
export const URL_CREATE_DELETE = '/sedo/template/delete'
export const URL_CREATE_UPDATE = '/sedo/template/update'

// REPORT
export const URL_REPORTS_LIST = '/apsd/reporting/list'
export const URL_REPORTS_ITEM = '/apsd/reporting/get'
export const URL_REPORTS_BUILD = '/apsd/reporting/build'
export const URL_REPORTS_GET = '/sedo/reporting/content/'
export const URL_REPORTS_BRANCH = '/sedo/os/branch/list?limit=100&offset=0'
export const URL_REPORTS_DEPARTMENT = '/sedo/os/branch/list?limit=100&offset=0'
export const URL_REPORTS_STATISTIC = '/apsd/reporting/email/statistic'
export const URL_REPORTS_DOCUMENT_PRINT = 'sedo/reporting/document_print'

// BASKET
export const URL_BASKET_LIST = '/apsd/basket/list'
export const URL_BASKET_DELETED = '/apsd/basket/deleteDocument'
export const URL_BASKET_RESTORE_DELETED = '/apsd/basket/delete'
export const URL_BASKET_ADD = '/apsd/basket/add'
export const URL_BASKET_DELETE_DOCUMENT = '/apsd/basket/deleteDocument'

// REFERENCE
export const URL_INFORMATION_LIST = '/apsd/information/structure/list'
export const URL_INFORMATION_FOLDER_CREATE = '/apsd/information/folder/create'
export const URL_INFORMATION_FILE_ADD = '/apsd/information/file/add'
export const URL_INFORMATION_FOLDER_EDIT = '/apsd/information/folder/edit'
export const URL_INFORMATION_DELETE = '/apsd/information/delete'

// DEPUTY
export const URL_DEPUTY_USERS_LIST = '/sedo/deputy/task/users'
export const URL_DEPUTY_TASK_LIST = '/apsd/task/v2/deputy/list'

export const URL_EXPORT = '/export/'
export const URL_EXPORT_FILE = '/export/file/'
// Kerberos
export const URL_KERBEROS_LOGIN = 'ts/kerberos/login'

// PRESET

export const URL_PRE_SET_FIELD_VALUES = '/apsd/title/pre_set/attribute'
