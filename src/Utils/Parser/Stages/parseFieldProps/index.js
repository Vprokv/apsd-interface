import parseFieldProps from './controller'
import { componentsMap, propsMap } from './constants'
import parsePlainProps from './Stages/parsePlainProps'
import comboboxProps from './Combobox'
import documentPickerProps from './DocumentPicker'
import orgstructureProps from './Orgstructure'

export {
  parseFieldProps,
  componentsMap,
  propsMap,
  parsePlainProps,
  comboboxProps,
  documentPickerProps,
  orgstructureProps,
}
export default parseFieldProps(propsMap, componentsMap)
