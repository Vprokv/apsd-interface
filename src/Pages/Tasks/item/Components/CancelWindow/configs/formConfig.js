import { required } from '@Components/Logic/Validator'
import Input from '@/Components/Fields/Input'

export const rules = {
  description: [{ validatorObject: required }],
}

export const fields = [
  {
    id: 'description',
    label: 'Причина аннулирования',
    placeholder: 'Укажите причину аннулирования',
    component: Input,
  },
]
