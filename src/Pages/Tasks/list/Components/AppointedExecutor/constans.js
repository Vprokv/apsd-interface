const STAND_IDLE_STATUS = 'stand_idle'
const NEW_STATUS = 'new'
const ACQUIRED_STATUS = 'acquired'
const CONSIDERED_WITH_REMARKS_STATUS = 'сonsidered_with_remarks'
const CONSIDERED_STATUS = 'сonsidered'
const APPROVED_STATUS = 'approved'
const NOT_APPROVED_STATUS = 'not_approved'
const RECALLED_STATUS = 'recalled'

export const StatusMap = {
  [STAND_IDLE_STATUS]: 'Разослано',
  [NEW_STATUS]: 'Не разослано',
  [ACQUIRED_STATUS]: 'Принято к исполнению',
  [CONSIDERED_WITH_REMARKS_STATUS]: 'Рассмотрено с замечаниями',
  [CONSIDERED_STATUS]: 'Рассмотренно',
  [APPROVED_STATUS]: 'Согласовано',
  [NOT_APPROVED_STATUS]: 'Не согласовано',
  [RECALLED_STATUS]: 'Отозвано',
}

export const colorsMap = {
  [STAND_IDLE_STATUS]: 'bg-blue-2',
  [NEW_STATUS]: 'bg-text-secondary',
  [ACQUIRED_STATUS]: 'bg-blue-1',
  [CONSIDERED_WITH_REMARKS_STATUS]: 'bg-color-red',
  [CONSIDERED_STATUS]: 'bg-green',
  [APPROVED_STATUS]: 'bg-green',
  [NOT_APPROVED_STATUS]: 'bg-color-red',
  [RECALLED_STATUS]: 'bg-color-red',
}
