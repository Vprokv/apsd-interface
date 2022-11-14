import Classification from '@/Pages/Tasks/item/Pages/Requisites/Components/Classification'
import Select from '@/Components/Inputs/Select'
import { NoFieldType } from '@/Pages/Tasks/item/Pages/Requisites/rules'
import DocumentSelect from '@/Components/Inputs/DocumentSelect'
import UserSelect from '@/Components/Inputs/UserSelect'
import Input from '@Components/Components/Inputs/Input'
import TextArea from '@Components/Components/Inputs/TextArea'
import DatePicker from '@/Components/Inputs/DatePicker'
import CheckBox from '@/Components/Inputs/CheckBox'
import { useContext } from 'react'
import { ApiContext } from '@/contants'
import { URL_ENTITY_LIST } from '@/ApiList'
import BaseUserSelect from '@/Components/Inputs/OrgStructure/BaseUserSelect'

const fields = {
  Classification: Classification,
  Combobox: Select,
  TextualCombobox: Select,
  DocStatus: NoFieldType,
  DocumentPicker: DocumentSelect,
  Orgstructure: (props) => <UserSelect returnObjects={true} {...props} />,
  UserSelect: (props) => <BaseUserSelect returnObjects={true} {...props} />,
  // UserSelect:(props) =>  BaseUserSelect,
  Text: Input,
  TextArea: TextArea,
  Date: DatePicker,
  Checkbox: CheckBox,
}

export const getField = (type) => fields[type] ?? fields.DocStatus
export const getLoadFunction = (api) => (type) => {
  if (!type) {
    return {}
  }

  return {
    loadFunction: async () => {
      const { data } = await api.post(URL_ENTITY_LIST, {
        type,
      })
      return data
    },
    valueKey: 'r_object_id',
    labelKey: 'dss_name',
  }
}
