import updateTabChildrenStates from './useUpdateTabChildrenStates'
import useTabStateUpdaterByName from './useTabStateUpdaterByName'

export {
  updateTabChildrenStates, // обновляет множество стейтов в рамках текущей вкладки, по названию стейта
  useTabStateUpdaterByName, // обновляет множество стейтов во всех вкладках, по названию стейта
}
