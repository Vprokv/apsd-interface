import useStagesHooksWrapper from './useStagesHooksWrapper'
import NoFieldType from '@/Components/NoFieldType'
import CreateFieldStage from '../CreateFieldStage'
import ParsePlainProps from './Stages/parsePlainProps'

// первый вызов параметры парсера, пайпланы для полей, типы полей, компонент на случай не найденного типа
const parseFieldProps =
  (propsMap, componentsMap, defaultComponent = NoFieldType) =>
  (state) =>
  (args) => {
    const { type } = args // получаем тип компонента
    const componentState = {
      hooks: [], // список хуков для рантаймового расчета пропсов
      props: CreateFieldStage(state)(args), // получаем или генерируем состояния поля
    }
    const { [type]: getPropsFunctions = [ParsePlainProps] } = propsMap // получаем пайплайн пропсов поля
    const { [type]: component = defaultComponent } = componentsMap // определяем компонент поля
    getPropsFunctions.forEach((func) => func(state)(componentState)(args)) // прогоняем через пайплайн состояния

    componentState.props.component =
      componentState.hooks.length > 0 // по наличиюю рантаймовых пропсов опередляем используем декоратор или сам компонент
        ? useStagesHooksWrapper(componentState.hooks, component)
        : component
  }

export default parseFieldProps
