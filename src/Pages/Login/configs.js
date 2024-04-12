import { LoginInput } from '@/Pages/Login/styles'
import { required } from '@Components/Logic/Validator'

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
]

export const rules = {
  login: [{ validatorObject: required }],
  password: [{ validatorObject: required }],
}
