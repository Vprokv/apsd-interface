export const EXPIRED = '?dueFrom=null&dueTo=-1'
export const EXPIRED_1_3 = '?dueFrom=1&dueTo=3'
export const EXPIRED_TODAY = '?dueFrom=0&dueTo=0'
export const EXPIRED_4_7 = '?dueFrom=4&dueTo=7'
export const EXPIRED_8 = '?dueFrom=8&dueTo=null'

export const TabNames = {
  '': 'Все задания',
  [EXPIRED]: 'Срок истек',
  [EXPIRED_TODAY]: 'Срок сегодня',
  [EXPIRED_1_3]: 'Срок через 1-3 дня',
  [EXPIRED_4_7]: 'Срок через 4-7 дней',
  [EXPIRED_8]: 'Срок больше недели',
}

export const TASK_TYPE = 'ddt_dict_task_type'
export const DOCUMENT_TYPE = 'ddt_type_config'

export const TasksPageRequestFilter = {
  [TASK_TYPE]: 'taskTypes', // array
  [DOCUMENT_TYPE]: 'docTypes', // array
}
