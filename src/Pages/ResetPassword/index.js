import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { WithWithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import Button from '@/Components/Button'
import {
  VALIDATION_RULE_REQUIRED,
  VALIDATION_RULE_SAME,
} from '@Components/Logic/Validator/constants'
import { Link } from 'react-router-dom'
import LoginTemplate from '../Login/LoginTemplate'
import { LoginInput } from '../Login/styles'

import { LOGIN_PAGE_PATH } from '../../routePaths'

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

const rules = {
  login: [{ name: VALIDATION_RULE_REQUIRED }],
  password: [{ name: VALIDATION_RULE_REQUIRED }],
  new_password: [
    { name: VALIDATION_RULE_REQUIRED },
    {
      name: VALIDATION_RULE_SAME,
      args: { fieldKey: 'confirmation_password', fieldKeyLabel: 'пароль' },
    },
  ],
  confirmation_password: [
    { name: VALIDATION_RULE_REQUIRED },
    {
      name: VALIDATION_RULE_SAME,
      args: { fieldKey: 'new_password', fieldKeyLabel: 'пароль' },
    },
  ],
}

function Login({ loginRequest }) {
  const [state, setState] = useState({})

  return (
    <LoginTemplate backgroundUrlPath="./d67acfda04fca2473676bbd7ef137b44.png">
      <WithWithValidationForm
        className="mb-4"
        value={state}
        onInput={setState}
        fields={fieldMap}
        inputWrapper={DefaultWrapper}
        rules={rules}
        onSubmit={loginRequest}
      >
        <div className="flex flex-col pt-9">
          <Button className="bg-blue-1 text-white mb-2" type="submit">
            Вход
          </Button>
          <Link className="w-full" to={LOGIN_PAGE_PATH}>
            <Button className="bg-light-gray w-full">Отмена</Button>
          </Link>
        </div>
      </WithWithValidationForm>
    </LoginTemplate>
  )
}

Login.propTypes = {}

export default Login
