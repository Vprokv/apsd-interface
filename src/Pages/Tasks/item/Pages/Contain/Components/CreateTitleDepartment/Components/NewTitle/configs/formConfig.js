import CheckBox from '@/Components/Inputs/CheckBox'
import Input from '@/Components/Fields/Input'
import { required } from '@Components/Logic/Validator'

export const rules = {
  name: [{ validatorObject: required }],
  code: [{ validatorObject: required }],
}

export const fields = [
  {
    id: 'name',
    label: 'Наименование',
    placeholder: 'Введите наименование',
    component: Input,
  },
  {
    id: 'code',
    label: 'Код',
    placeholder: 'Введите код',
    component: Input,
  },
  {
    id: 'availableProjector',
    component: CheckBox,
    className: 'font-size-12',
    text: 'Доступно проектировщику',
  },
]
