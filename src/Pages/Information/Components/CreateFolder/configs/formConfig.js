import Input from '@/Components/Fields/Input'
import { required } from '@Components/Logic/Validator'

export const rules = {
  name: [{ validatorObject: required }],
}

export const fields = [
  {
    id: 'name',
    label: 'Наименование',
    placeholder: 'Наименование',
    component: Input,
  },
]
