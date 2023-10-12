import useStagesHooksWrapper from './useStagesHooksWrapper'
import { componentsMap, propsMap } from './constants'
import NoFieldType from '@/Components/NoFieldType'
import CreateFieldStage from '../CreateFieldStage'
import ParsePlainProps from './Stages/parsePlainProps'

export const parseFieldProps =
  (propsMap, componentsMap) => (state) => (args) => {
    const { type } = args
    const componentState = {
      hooks: [],
      props: CreateFieldStage(state)(args),
    }
    const { [type]: getPropsFunctions = [ParsePlainProps] } = propsMap
    const { [type]: component = NoFieldType } = componentsMap
    getPropsFunctions.forEach((func) => func(state)(componentState)(args))

    componentState.props.component =
      componentState.hooks.length > 0
        ? useStagesHooksWrapper(componentState.hooks, component)
        : component
  }

export default parseFieldProps(propsMap, componentsMap)
