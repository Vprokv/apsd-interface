import {
  comboboxProps,
  componentsMap,
  documentPickerProps,
  orgstructureProps,
  parseFieldProps,
} from '@/Utils/Parser/Stages/parseFieldProps'
import customValuesStage from './customValuesStage'
import addUserFullNameInOptionsStage from './addUserFullNameInOptionsStage'
import orgstructureAddFilterSourceStage from './orgstructureAddFilterSourceStage'
import parsePropsRequisites from '@/Pages/Tasks/item/Pages/Requisites/parser/parsePropsComponent'
import ParsePlainProps from '@/Utils/Parser/Stages/parseFieldProps/Stages/parsePlainProps'

export const propsMap = {
  Combobox: [customValuesStage, ...comboboxProps],
  DocumentPicker: [customValuesStage, ...documentPickerProps],
  Orgstructure: [
    customValuesStage,
    addUserFullNameInOptionsStage,
    orgstructureAddFilterSourceStage,
    parsePropsRequisites,
    ...orgstructureProps,
  ],
  Classification: [ParsePlainProps, customValuesStage],
}

export default parseFieldProps(propsMap, componentsMap)
