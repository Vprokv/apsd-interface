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

export const propsMap = {
  Combobox: [customValuesStage, ...comboboxProps],
  DocumentPicker: [customValuesStage, ...documentPickerProps],
  Orgstructure: [
    customValuesStage,
    addUserFullNameInOptionsStage,
    orgstructureAddFilterSourceStage,
    // parsePropsRequisites,
    ...orgstructureProps,
  ],
}

export default parseFieldProps(propsMap, componentsMap)
