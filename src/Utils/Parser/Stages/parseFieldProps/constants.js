import comboboxProps from './Combobox'
import documentPickerProps from './DocumentPicker'
import orgstructureProps from './Orgstructure'
import Classification from '@/Pages/Tasks/item/Pages/Requisites/Components/Classification'
import NoFieldType from '@/Components/NoFieldType'
import DocumentSelect from '@/Components/Inputs/DocumentSelect'
import UserSelect from '@/Components/Inputs/UserSelect'
import DatePicker from '@/Components/Inputs/DatePicker'
import CheckBox from '@/Components/Inputs/CheckBox'
import TextArea from '@Components/Components/Inputs/TextArea'
import Input from '@Components/Components/Inputs/Input'
import Select from '@/Components/Inputs/Select'

export const componentsMap = {
  Classification: Classification,
  Combobox: Select,
  DocStatus: NoFieldType,
  DocumentPicker: DocumentSelect,
  Orgstructure: UserSelect,
  Text: Input,
  TextArea: TextArea,
  Date: DatePicker,
  Checkbox: CheckBox,
  // ExpansionPanel
  // Скрывающаяся панель
  // TextualCombobox
  // Денормализованное поле ОШС
  // Выбор пользователей
  // Checkbox
  // Флаг
  // Классификация
  // Branch
  // Филиал
  // Department
  // Отдел
  // TextualBranch
  // Филиал
}

export const propsMap = {
  Combobox: comboboxProps,
  DocumentPicker: documentPickerProps,
  Orgstructure: orgstructureProps,
}
