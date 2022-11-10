import Classification from '@/Pages/Tasks/item/Pages/Requisites/Components/Classification'
import Select from '@/Components/Inputs/Select'
import { NoFieldType } from '@/Pages/Tasks/item/Pages/Requisites/rules'
import DocumentSelect from '@/Components/Inputs/DocumentSelect'
import UserSelect from '@/Components/Inputs/UserSelect'
import Input from '@apsd/components/Components/Inputs/Input'
import TextArea from '@apsd/components/Components/Inputs/TextArea'
import DatePicker from '@/Components/Inputs/DatePicker'
import CheckBox from '@/Components/Inputs/CheckBox'
import { useContext } from 'react'
import { ApiContext } from '@/contants'
import { URL_ENTITY_LIST } from '@/ApiList'
import BaseUserSelect from "@/Components/Inputs/OrgStructure/BaseUserSelect";

const fields = {
  Classification: Classification,
  Combobox: Select,
  TextualCombobox: Select,
  DocStatus: NoFieldType,
  DocumentPicker: DocumentSelect,
  Orgstructure: UserSelect,
  UserSelect: BaseUserSelect,
  Text: Input,
  TextArea: TextArea,
  Date: DatePicker,
  Checkbox: CheckBox,
}

export const getField = (type) => fields[type] ?? fields.DocStatus
export const getLoadFunction = (api) => (type) => {
  console.log(type, 'type')
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
