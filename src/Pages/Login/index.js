import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { WithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import Button from '@/Components/Button'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import { Link } from 'react-router-dom'
import { LoginInput } from './styles'

import { RESET_PASSWORD_PAGE_PATH } from '@/routePaths'
import LoginTemplate from './LoginTemplate'
import {
  NOTIFICATION_TYPE_ERROR,
  useOpenNotification,
} from '@/Components/Notificator'
import { API_URL } from '@/api'

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

const rules = {
  login: [{ name: VALIDATION_RULE_REQUIRED }],
  password: [{ name: VALIDATION_RULE_REQUIRED }],
}

const notifyMap = {
  'https://psd.moesk.ru': 'http://10.42.226.32:7777/psd/',
  'http://10.20.56.50/': 'http://10.42.226.32:7777/psd/',
  'http://10.20.56.61/': 'http://10.68.130.25:9999/dp-archive/',
  'http://10.20.56.50': 'http://10.42.226.32:7777/psd/',
  'http://10.20.56.61': 'http://10.68.130.25:9999/dp-archive/',
}

function Login({ loginRequest }) {
  const [state, setState] = useState({})

  const getNotification = useOpenNotification()

  useEffect(() => {
    getNotification({
      type: NOTIFICATION_TYPE_ERROR,
      message: (() => (
        <>
          <div className="">
            С 12:00 13.12.2023г. система работает в тестовом режиме. Для
            продолжения работы перейдите по ссылке:
          </div>
          <a className={'color-blue-1'} href={notifyMap[API_URL]}>
            {notifyMap[API_URL]}
          </a>
        </>
      ))(),
      gap: 0.1,
    })
  }, [getNotification])

  return (
    <LoginTemplate backgroundUrlPath="./login_bg.png">
      <WithValidationForm
        className="mb-4"
        value={state}
        onInput={setState}
        fields={fieldMap}
        inputWrapper={DefaultWrapper}
        rules={rules}
        onSubmit={loginRequest}
      >
        <div className="flex flex-col">
          <Link
            className="color-blue-1 font-size-14 ml-auto font-medium mb-9"
            to={RESET_PASSWORD_PAGE_PATH}
          >
            Смена пароля
          </Link>
          <Button className="bg-blue-1 text-white" type="submit">
            Вход
          </Button>
        </div>
      </WithValidationForm>
    </LoginTemplate>
  )
}

Login.propTypes = {
  loginRequest: PropTypes.func.isRequired,
}

export default Login
