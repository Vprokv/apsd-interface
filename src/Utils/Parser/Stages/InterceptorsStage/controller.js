import { interceptorsState } from './constants'
const InterceptorsStage = (state) => {
  if (!state[interceptorsState]) {
    state[interceptorsState] = new Map()
    state.formProps.interceptors = new Map()
  }
  return ({ field, targetKey, handler = () => undefined }) => {
    // если для текущего поля нет зависимостей, инициализурем обработчик и состояние
    if (!state[interceptorsState].has(field)) {
      const depsList = [] // создаем массив зависимых полей от текущего поля
      state[interceptorsState].set(field, depsList)

      // функция вызываеться формой, сбрасывает значение каждого зависимового поля, находящегося в списке
      state.formProps.interceptors.set(field, (args) => {
        const { handleInput } = args
        depsList.forEach(([targetKey, handler]) =>
          handleInput(handler(args), targetKey),
        )
      })
    }
    // если текущее поле уже имеет зависимости, добавляем в список зависимостей новое поле и обработчик
    state[interceptorsState].get(field).push([targetKey, handler])
  }
}

export default InterceptorsStage
