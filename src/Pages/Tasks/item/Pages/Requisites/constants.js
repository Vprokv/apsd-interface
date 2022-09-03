import Classification from "./Components/Classification";
import Select from "@/Components/Inputs/Select";
import TextArea from "@Components/Components/Inputs/TextArea";
import Input from "@Components/Components/Inputs/Input";
import UserSelect from "@/Components/Inputs/UserSelect";
import DocumentSelect from "@/Components/Inputs/DocumentSelect";
import DatePicker from "@/Components/Inputs/DatePicker";
import CheckBox from "@/Components/Inputs/CheckBox";

export const fieldsDictionary = {
  Classification: Classification,
  Combobox: Select,
  Text: Input,
  TextArea,
  Orgstructure: UserSelect,
  DocumentPicker: DocumentSelect,
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

export const NoFieldType = () => <div>no fieldType</div>