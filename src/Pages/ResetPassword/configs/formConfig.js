import { LoginInput } from '@/Pages/Login/styles'
import { required, same } from '@Components/Logic/Validator'

export const fieldMap = [
  {
    label: 'Логин',
    id: 'login',
    component: LoginInput,
    placeholder: 'Введите свой логин',
  },
  {
    label: 'Пароль',
    id: 'password',
    type: 'password',
    component: LoginInput,
    placeholder: 'Введите свой пароль',
  },
  {
    label: 'Новый пароль',
    id: 'new_password',
    type: 'password',
    component: LoginInput,
    placeholder: 'Введите свой пароль',
  },
  {
    label: 'Подтверждение',
    id: 'confirmation_password',
    type: 'password',
    component: LoginInput,
    placeholder: 'Подтвердите пароль',
  },
]

export const rules = {
  login: [{ validatorObject: required }],
  password: [{ validatorObject: required }],
  new_password: [
    { validatorObject: required },
    {
      validatorObject: same,
      args: { fieldKey: 'confirmation_password', fieldKeyLabel: 'пароль' },
    },
  ],
  confirmation_password: [
    { validatorObject: same },
    {
      validatorObject: required,
      args: { fieldKey: 'new_password', fieldKeyLabel: 'пароль' },
    },
  ],
}
