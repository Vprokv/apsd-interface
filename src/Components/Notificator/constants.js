export const NOTIFICATION_TYPE_INFO = 'info'
export const NOTIFICATION_TYPE_SUCCESS = 'success'
export const NOTIFICATION_TYPE_ERROR = 'error'

export const defaultFunctionsMap = {
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Запрос отправлен успешно',
    }
  },
  500: () => {
    return { type: NOTIFICATION_TYPE_ERROR, message: 'Запрос не отправлен' }
  },
  404: () => {
    return {
      type: NOTIFICATION_TYPE_ERROR,
      message: 'Ошибка выполнения запроса',
    }
  },
  412: (message) => {
    return {
      type: NOTIFICATION_TYPE_ERROR,
      message,
    }
  },
}
