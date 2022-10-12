import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { WithWithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import Button from '@/Components/Button'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import { Link } from 'react-router-dom'
import { LoginInput } from './styles'

import { RESET_PASSWORD_PAGE_PATH } from '../../routePaths'
import LoginTemplate from './LoginTemplate'

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

function Login({ loginRequest }) {
  const [state, setState] = useState({})

  return (
    <LoginTemplate backgroundUrlPath="./login_bg.png">
      <WithWithValidationForm
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
      </WithWithValidationForm>
    </LoginTemplate>
  )
}

Login.propTypes = {}

export default Login
