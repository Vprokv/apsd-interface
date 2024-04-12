import Input from '@/Components/Fields/Input'
import { required } from '@Components/Logic/Validator'

export const rules = {
  reportText: [{ validatorObject: required }],
}

export const fields = [
  {
    id: 'reportText',
    label: 'Причина отклонения',
    placeholder: 'Укажите причину отклонения',
    component: Input,
  },
]
