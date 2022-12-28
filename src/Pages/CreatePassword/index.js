import { useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { WithWithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import Button from '@/Components/Button'
import {
  VALIDATION_RULE_REGEX,
  VALIDATION_RULE_REQUIRED,
  VALIDATION_RULE_SAME,
} from '@Components/Logic/Validator/constants'
import { Link } from 'react-router-dom'
import LoginTemplate from '../Login/LoginTemplate'
import { LoginInput } from '../Login/styles'

import { LOGIN_PAGE_PATH } from '@/routePaths'
import { URL_ENTITY_LIST, URL_USER_PASSWORD_RULES } from '@/ApiList'
import { TASK_TYPE } from '@/Pages/Tasks/list/constants'
import { ApiContext, TokenContext } from '@/contants'
import {
  backendKeysMap,
  getRules,
  messagesMap,
  VALIDATION_RULE_CUSTOM_REGEX,
} from '@/Pages/CreatePassword/constans'

export const fieldMap = [
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

const CreatePassword = ({ loginRequest }) => {
  const api = useContext(ApiContext)
  const { token } = useContext(TokenContext)
  const [state, setState] = useState({})
  const [customRules, setRules] = useState({})

  const { rules, validators } = useMemo(() => {
    const { reg, anotherRules } = backendKeysMap.reduce(
      (acc, val) => getRules(val)(acc)(customRules),
      { reg: {}, anotherRules: [] },
    )

    const resp = {
      rules: {
        new_password: [
          ...anotherRules,
          { name: VALIDATION_RULE_REQUIRED },
          {
            name: VALIDATION_RULE_SAME,
            args: {
              fieldKey: 'confirmation_password',
              fieldKeyLabel: 'пароль',
            },
          },
        ],
        confirmation_password: [
          { name: VALIDATION_RULE_REQUIRED },
          {
            name: VALIDATION_RULE_SAME,
            args: { fieldKey: 'new_password', fieldKeyLabel: 'пароль' },
          },
        ],
      },
      validators: {},
    }

    if (Object.keys(reg).length > 1) {
      resp.rules['new_password'].push({
        name: VALIDATION_RULE_CUSTOM_REGEX,
        args: { regex: new RegExp(Object.values(reg).join('')) },
      })

      resp.validators = {
        [VALIDATION_RULE_CUSTOM_REGEX]: {
          resolver: ({ value, args: { regex } }) => {
            return regex.test(value)
          },
          message: ({ value }) => {
            let mess = ''
            Object.keys(reg).forEach((val) => {
              if (!new RegExp(reg[val]).test(value)) {
                mess = messagesMap[val](customRules)
              }
            })
            return mess
          },
        },
      }
    }

    return resp
  }, [customRules])

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_USER_PASSWORD_RULES, { token })
      setRules(data)
    })()
  }, [api, token])

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
        validators={validators}
      >
        <div className="flex flex-col pt-9">
          <Button className="bg-blue-1 text-white mb-2" type="submit">
            Сохранить
          </Button>
          <Link className="w-full" to={LOGIN_PAGE_PATH}>
            <Button className="bg-light-gray w-full">Отмена</Button>
          </Link>
        </div>
      </WithWithValidationForm>
    </LoginTemplate>
  )
}

CreatePassword.propTypes = {
  loginRequest: PropTypes.func.isRequired,
}

export default CreatePassword
