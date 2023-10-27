import Select from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import Input from '@Components/Components/Inputs/Input'
import DocumentSelect from '@/Components/Inputs/DocumentSelect'
import getLoadFunction from '@/Utils/Parser/Stages/parseFieldProps/Stages/getLoadFunction'
import parseMultiply from '@/Utils/Parser/Stages/parseFieldProps/Stages/parseMultiply'
import parsePlainProps from '../../../Utils/Parser/Stages/parseFieldProps/Stages/parsePlainProps'
import BaseUserSelect from '@/Components/Inputs/OrgStructure/BaseUserSelect'
import DatePicker from '@/Components/Inputs/DatePicker'
import CheckBox from '@/Components/Inputs/CheckBox'
import refTransmissionStage from './refTransmitionStage'
import addDataPickerAdapter from './addDataPickerAdapter'
import getFilters from '@/Utils/Parser/Stages/parseFieldProps/Stages/FilterStage'
import addOrgstructureResponseAdapter from './addOrgstructureResponseAdapter'
import { setOrgstructureRefKey } from '@/Utils/Parser/Stages/parseFieldProps/Orgstructure'
import getBranchLoadFunction from './getBranchLoadFunction'
import getDepartmentLoadFunction from '@/Pages/Rporting/Parser/getDepartmentLoadFunction'
import getTitleDocumentLoadFunction from '@/Pages/Rporting/Parser/getTitleDocumentLoadFunction'
import TextArea from '@Components/Components/Inputs/TextArea'
import ParsePlainProps from '@/Utils/Parser/Stages/parseFieldProps/Stages/parsePlainProps'
import parseDocumentPickerProps from '@/Pages/Rporting/Parser/parseDocumentPickerProps'
import parseReadOnlyRule from '@/Utils/Parser/Stages/parseReadOnlyRule'
import parseVisibilityRule from '@/Utils/Parser/Stages/parseVisibilityRule'
import parseValidationRules from '@/Utils/Parser/Stages/parseValidationRules'
import { parseFieldProps } from '@/Utils/Parser/Stages/parseFieldProps'
import TitleDocument from "@/Pages/Rporting/Components/TitleDocument";

const fields = {
  Combobox: Select,
  Date: DatePicker,
  Checkbox: CheckBox,
  InputString: Input,
  Orgstructure: UserSelect,
  Branch: Select,
  Department: Select,
  TitleDocument: TitleDocument,
  UserSelect: BaseUserSelect,
  Text: Input,
  TextArea: TextArea,
  Document: DocumentSelect,
}

export const propsMap = {
  Combobox: [
    getLoadFunction,
    parseMultiply,
    parsePlainProps,
    refTransmissionStage,
  ],
  Date: [parsePlainProps, addDataPickerAdapter],
  Orgstructure: [
    parsePlainProps,
    getFilters,
    parseMultiply,
    addOrgstructureResponseAdapter,
    setOrgstructureRefKey,
  ],
  Branch: [getBranchLoadFunction, parseMultiply, parsePlainProps],
  Department: [getDepartmentLoadFunction, parseMultiply, parsePlainProps],
  TitleDocument: [getTitleDocumentLoadFunction, parseMultiply, parsePlainProps],
  Document: [
    ParsePlainProps,
    getFilters,
    parseMultiply,
    parseDocumentPickerProps,
  ],
}

const reportParserStages = [
  parseReadOnlyRule,
  parseVisibilityRule,
  parseValidationRules,
  parseFieldProps(propsMap, fields),
]

export default reportParserStages
