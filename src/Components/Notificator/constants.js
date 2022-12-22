export const NOTIFICATION_TYPE_INFO = 'info'
export const NOTIFICATION_TYPE_SUCCESS = 'success'
export const NOTIFICATION_TYPE_ERROR = 'error'

export const defaultMessageMap = {
  200: { type: NOTIFICATION_TYPE_SUCCESS, message: 'Запрос отправлен успешно' },
  500: { type: NOTIFICATION_TYPE_ERROR, message: 'Запрос не отправлен' },
  404: { type: NOTIFICATION_TYPE_ERROR, message: 'Ошибка выполнения запроса' },
}
