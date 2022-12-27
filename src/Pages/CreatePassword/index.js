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

const passText = {
  includeDigit: 'арабские цифры (0...9)',
  includeUpperCase: 'строчные',
  includeLowerCase: 'прописные',
  includeSpecial: 'спец.символы',
}

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

//regex, errors and map message, keys in backend fields

const rules = {
  new_password: [
    { name: VALIDATION_RULE_REQUIRED },
    {
      name: VALIDATION_RULE_SAME,
      args: { fieldKey: 'confirmation_password', fieldKeyLabel: 'пароль' },
    },
    { name: VALIDATION_RULE_REGEX, args: { regex: new RegExp([].join('')) } },
  ],
  confirmation_password: [
    { name: VALIDATION_RULE_REQUIRED },
    {
      name: VALIDATION_RULE_SAME,
      args: { fieldKey: 'new_password', fieldKeyLabel: 'пароль' },
    },
  ],
}

const CreatePassword = ({ loginRequest }) => {
  const api = useContext(ApiContext)
  const { token } = useContext(TokenContext)
  const [state, setState] = useState({})
  const [customRules, setRules] = useState({})

  const validators = {
    [VALIDATION_RULE_REGEX]: {
      resolver: ({ value, args: { regex } }) => regex.test(value),
      message: 'Значение поля не соотвествует формату',
    },
  }

  const symb = useMemo(
    () =>
      customRules.includeDigit &&
      `Должен содержать не менее ${customRules.minLength} и не более ${customRules.maxLength} символов`,
    [customRules.includeDigit, customRules.maxLength, customRules.minLength],
  )

  const str = useMemo(() => {
    const {
      includeUpperCase,
      includeLowerCase,
      includeDigit,
      includeSpecial,
      specialChars,
    } = customRules

    const words = `${
      includeUpperCase && includeLowerCase
        ? 'строчные и прописные'
        : includeUpperCase
        ? 'прописные'
        : 'строчные'
    } латинские буквы ${
      includeUpperCase && includeLowerCase
        ? '(A..z)'
        : includeUpperCase
        ? '(A..Z)'
        : '(a..z)'
    }  `

    const int = includeDigit && 'арабские цифры (0...9)'
    const special =
      includeSpecial && specialChars && `спец. символы ${specialChars}`

    return `Должен содержать ${words}, ${int}, ${special} `
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
      >
        <div className="flex flex-col pt-9">
          <Button className="bg-blue-1 text-white mb-2" type="submit">
            Сохранить
          </Button>
          <Link className="w-full" to={LOGIN_PAGE_PATH}>
            <Button className="bg-light-gray w-full">Отмена</Button>
          </Link>
          {/*<div className="mt-10 font-size-14 color-red ">*/}
          {/*  Пароль: <br />*/}
          {/*  Не должен повторять предыдущий пароль*/}
          {/*  <div>{symb}</div>*/}
          {/*  <div>{str}</div>*/}
          {/*</div>*/}
        </div>
      </WithWithValidationForm>
    </LoginTemplate>
  )
}

CreatePassword.propTypes = {
  loginRequest: PropTypes.func.isRequired,
}

export default CreatePassword
