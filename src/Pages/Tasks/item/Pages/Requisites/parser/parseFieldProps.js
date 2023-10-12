import {
  comboboxProps,
  componentsMap,
  documentPickerProps,
  orgstructureProps,
  parseFieldProps,
} from '@/Utils/Parser/Stages/parseFieldProps'
import customValuesStage from './customValuesStage'
import addUserFullNameInOptionsStage from './addUserFullNameInOptionsStage'
import addFilterSourceStage from './addFilterSourceStage'

export const propsMap = {
  Combobox: [customValuesStage, ...comboboxProps],
  DocumentPicker: [customValuesStage, ...documentPickerProps],
  Orgstructure: [
    customValuesStage,
    addUserFullNameInOptionsStage,
    addFilterSourceStage,
    ...orgstructureProps,
  ],
}

export default parseFieldProps(propsMap, componentsMap)
