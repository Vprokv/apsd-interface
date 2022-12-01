import { Select } from './Select'
import AutoLoadable from '@Components/Components/Inputs/AutoLoadable'
import Loadable from '@Components/Components/Inputs/Loadable'

const AutoLoadableSelect = Loadable(AutoLoadable(Select))
export default AutoLoadableSelect
