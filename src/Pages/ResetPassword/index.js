import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import Button from '@/Components/Button'
import { Link } from 'react-router-dom'
import LoginTemplate from '../Login/LoginTemplate'

import { LOGIN_PAGE_PATH } from '@/routePaths'
import { fieldMap, rules } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'
import Validator from '@Components/Logic/Validator'

function Login({ loginRequest }) {
  const [state, setState] = useState({})
  const [validationState, setValidationState] = useState({})

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
            inputWrapper={WithValidationStateInputWrapper}
          >
            <div className="flex flex-col pt-9">
              <Button className="bg-blue-1 text-white mb-2" type="submit">
                Вход
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

Login.propTypes = {
  loginRequest: PropTypes.func.isRequired,
}

export default Login
