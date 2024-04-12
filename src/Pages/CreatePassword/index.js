import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Validator } from '@Components/Logic/Validator/ValidatorNext'
import Form, { WithValidationForm } from '@Components/Components/Forms'
import { DefaultInputWrapper } from '@/Components/Forms/ValidationStateUi/DefaultInputWrapper'
import Button from '@/Components/Button'
import {
  VALIDATION_RULE_REQUIRED,
  VALIDATION_RULE_SAME,
} from '@Components/Logic/Validator/constants'
import { Link } from 'react-router-dom'
import LoginTemplate from '../Login/LoginTemplate'
import { LoginInput } from '../Login/styles'

import { LOGIN_PAGE_PATH } from '@/routePaths'
import { URL_USER_PASSWORD_RULES } from '@/ApiList'
import { ApiContext, TokenContext } from '@/contants'
import {
  backendKeysMap,
  getRules,
  messagesMap,
  VALIDATION_RULE_CUSTOM_REGEX,
} from '@/Pages/CreatePassword/constans'
import { useResolveCreatePasswordRules } from '@/Pages/CreatePassword/useResolveCreatePasswordRules'

export const fieldMap = [
  {
    label: 'Новый пароль',
    id: 'new_password',
    type: 'password',
    component: (props) => <DefaultInputWrapper {...props} inputComponent={LoginInput}/>,
    placeholder: 'Введите свой пароль',
  },
  {
    label: 'Подтверждение',
    id: 'confirmation_password',
    type: 'password',
    component: (props) => <DefaultInputWrapper {...props} inputComponent={LoginInput}/>,
    placeholder: 'Подтвердите пароль',
  },
]

const CreatePassword = ({ loginRequest }) => {
  const api = useContext(ApiContext)
  const { token } = useContext(TokenContext)
  const [state, setState] = useState({})
  const [rules, setRules] = useState({})
  const [validationState, setValidationState] = useState({})
  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_USER_PASSWORD_RULES, { token })
      setRules(useResolveCreatePasswordRules(data))
    })()
  }, [api, token])
console.log(rules)
  return (
    <LoginTemplate backgroundUrlPath="./d67acfda04fca2473676bbd7ef137b44.png">
      <Validator
        rules={rules}
        onSubmit={loginRequest}
        value={state}
        validationState={validationState}
        setValidationState={useCallback(
          (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
          [],
        )}
      >
        {({ onSubmit }) => (
          <Form
            className="mb-4"
            onSubmit={onSubmit}
            value={state}
            onInput={setState}
            fields={fieldMap}
            inputWrapper={({ children }) => children}
          >
            <div className="flex flex-col pt-9">
              <Button className="bg-blue-1 text-white mb-2" type="submit">
                Сохранить
              </Button>
              <Link className="w-full" to={LOGIN_PAGE_PATH}>
                <Button className="bg-light-gray w-full">Отмена</Button>
              </Link>
            </div>
          </Form>
        )}
      </Validator>
    </LoginTemplate>
  )
}

CreatePassword.propTypes = {
  loginRequest: PropTypes.func.isRequired,
}

export default CreatePassword
