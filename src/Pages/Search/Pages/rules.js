import Classification from '@/Pages/Tasks/item/Pages/Requisites/Components/Classification'
import Select from '@/Components/Inputs/Select'
import NoFieldType from '@/Components/NoFieldType'
import UserSelect from '@/Components/Inputs/UserSelect'
import Input from '@Components/Components/Inputs/Input'
import TextArea from '@Components/Components/Inputs/TextArea'
import DatePicker from '@/Components/Inputs/DatePicker'
import CheckBox from '@/Components/Inputs/CheckBox'
import { URL_ENTITY_LIST } from '@/ApiList'
import BaseUserSelect from '@/Components/Inputs/OrgStructure/BaseUserSelect'
import DateWithButton from '@/Pages/Search/Pages/Components/DateWithButton'

const fields = {
  Classification: Classification,
  Combobox: Select,
  TextualCombobox: Select,
  DocStatus: NoFieldType,
  Orgstructure: (props) => <UserSelect valueKey="userName" {...props} />,
  UserSelect: (props) => <BaseUserSelect vakueKey="userName" {...props} />,
  // UserSelect:(props) =>  BaseUserSelect,
  Text: Input,
  TextArea: TextArea,
  Date: DateWithButton,
  Checkbox: CheckBox,
}

//Combobox
//Orgstructure
//Orgstructure
//Checkbox
//Date
//Branch
//Department
//Document
//DocumentPicker
//NoFieldType

export const getField = (type) => fields[type] ?? fields.DocStatus
export const getLoadFunction =
  (api) =>
  ({
    dss_component_reference,
    dss_reference_attr_label,
    dss_reference_attr,
  }) => {
    if (!dss_component_reference) {
      return {}
    }

    return {
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: dss_component_reference,
          query,
        })
        return data
      },
      valueKey: dss_reference_attr || 'r_object_id',
      labelKey: dss_reference_attr_label || 'dss_name',
    }
  }
