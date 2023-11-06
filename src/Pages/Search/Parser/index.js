import Classification from '@/Pages/Tasks/item/Pages/Requisites/Components/Classification'
import NoFieldType from '@/Components/NoFieldType'
import UserSelect from '@/Components/Inputs/UserSelect'
import BaseUserSelect from '@/Components/Inputs/OrgStructure/BaseUserSelect'
import DatePicker from '@/Components/Inputs/DatePicker'
import CheckBox from '@/Components/Inputs/CheckBox'
import {
  AutoLoadableSelect,
  WithAutoLoadableAlwaysRenderValuesSelect,
} from '@/Components/Inputs/Select'
import Input from '@Components/Components/Inputs/Input'
import TextArea from '@Components/Components/Inputs/TextArea'
import parseFieldProps from '@/Utils/Parser/Stages/parseFieldProps/controller'
import parsePlainProps from '@/Utils/Parser/Stages/parseFieldProps/Stages/parsePlainProps'
import resolveOperatorsStage from './resolveOperatorsStage'
import getLoadFunction from '@/Utils/Parser/Stages/parseFieldProps/Stages/getLoadFunction'
import parseMultiply from '@/Utils/Parser/Stages/parseFieldProps/Stages/parseMultiply'
import setOrgstructureValueKey from '@/Pages/Search/Parser/setOrgstructureValueKey'
import getFilters from '@/Utils/Parser/Stages/parseFieldProps/Stages/FilterStage'
import { setOrgstructureRefKey } from '@/Utils/Parser/Stages/parseFieldProps/Orgstructure'
import setDataPickerRangeStage from '@/Pages/Search/Parser/setDataPickerRangeStage'
import parseVisibilityRule from '@/Utils/Parser/Stages/parseVisibilityRule'

const fields = {
  Classification: Classification,
  Combobox: AutoLoadableSelect,
  TextualCombobox: AutoLoadableSelect,
  DocStatus: NoFieldType,
  Orgstructure: (props) => (
    <UserSelect
      // SelectComponent={WithAutoLoadableAlwaysRenderValuesSelect} //TODO разобраться почему не работает
      SelectComponent={AutoLoadableSelect}
      {...props}
    />
  ),
  UserSelect: (props) => (
    <BaseUserSelect SelectComponent={AutoLoadableSelect} {...props} />
  ),
  Text: Input,
  TextArea: TextArea,
  Date: DatePicker,
  Checkbox: CheckBox,
}

const propsMap = {
  Classification: [parsePlainProps, resolveOperatorsStage],
  Combobox: [
    getLoadFunction,
    parseMultiply,
    parsePlainProps,
    resolveOperatorsStage,
    setOrgstructureValueKey,
  ],
  TextualCombobox: [
    getLoadFunction,
    parseMultiply,
    parsePlainProps,
    resolveOperatorsStage,
    setOrgstructureValueKey,
  ],
  DocStatus: [parsePlainProps, resolveOperatorsStage],
  Orgstructure: [
    parsePlainProps,
    getFilters,
    parseMultiply,
    setOrgstructureRefKey,
    resolveOperatorsStage,
    setOrgstructureValueKey,
  ],
  UserSelect: [
    parsePlainProps,
    getFilters,
    parseMultiply,
    setOrgstructureRefKey,
    resolveOperatorsStage,
    setOrgstructureValueKey,
  ],
  Text: [parsePlainProps, resolveOperatorsStage],
  TextArea: [parsePlainProps, resolveOperatorsStage],
  Date: [parsePlainProps, resolveOperatorsStage, setDataPickerRangeStage],
  Checkbox: [parsePlainProps, resolveOperatorsStage],
}

const searchParseFieldProps = parseFieldProps(propsMap, fields)

export const searchParserStages = [parseVisibilityRule, searchParseFieldProps]
