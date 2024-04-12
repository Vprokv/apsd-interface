import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import Button from '@/Components/Button'
import { Link } from 'react-router-dom'
import { fieldMap, rules } from './configs'
import Validator from '@Components/Logic/Validator'

import { RESET_PASSWORD_PAGE_PATH } from '@/routePaths'
import LoginTemplate from './LoginTemplate'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

// const notifyMap = {
//   'https://psd.moesk.ru': 'http://10.42.226.32:7777/psd/',
//   'http://10.20.56.50/': 'http://10.42.226.32:7777/psd/',
//   'http://10.20.56.61/': 'http://10.68.130.25:9999/dp-archive/',
//   'http://10.20.56.50': 'http://10.42.226.32:7777/psd/',
//   'http://10.20.56.61': 'http://10.68.130.25:9999/dp-archive/',
// }

function Login({ loginRequest }) {
  const [state, setState] = useState({})
  const [validationState, setValidationState] = useState({})

  // const getNotification = useOpenNotification()
  //
  // useEffect(() => {
  //   getNotification({
  //     type: NOTIFICATION_TYPE_ERROR,
  //     message: (() => (
  //       <>
  //         <div className="">
  //           С 12:00 13.12.2023г. система работает в тестовом режиме. Для
  //           продолжения работы перейдите по ссылке:
  //         </div>
  //         <a className={'color-blue-1'} href={notifyMap[API_URL]}>
  //           {notifyMap[API_URL]}
  //         </a>
  //       </>
  //     ))(),
  //     gap: 0.1,
  //   })
  // }, [getNotification])

  return (
    <LoginTemplate backgroundUrlPath="./login_bg.png">
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
