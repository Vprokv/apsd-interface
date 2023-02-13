import PropTypes from 'prop-types'
import LoginLogo from './Login_logo.png'
import {
  Background,
  FormContainer,
  LoginContainer,
  LoginFormContainer,
} from './styles'
import { useContext, useEffect, useState } from 'react'
import {
  URL_REVISION_APSD,
  URL_REVISION_CHAT,
  URL_REVISION_SEDO,
} from '@/ApiList'
import { ApiContext } from '@/contants'
import axios from 'axios'

const LoginTemplate = ({ children, backgroundUrlPath }) => {
  const api = useContext(ApiContext)
  const [direction, setDirection] = useState({})

  useEffect(() => {
    ;(async () => {
      const [{ data: apsd }, { data: ts }, { data: sedo }, { data: support }] =
        await Promise.all([
          api.post(URL_REVISION_APSD),
          api.post(URL_REVISION_CHAT),
          api.post(URL_REVISION_SEDO),
          axios.get('/settings.json'),
        ])
      setDirection({ apsd, ts, sedo, support })
    })()
  }, [api])

  return (
    <LoginContainer сlassName="flex-col">
      <LoginFormContainer>
        <div className="mt-auto font-size-12 font-medium color-white">
          <div>Сборка интерфейса:</div>
          <div>{process.env.APP_BUILD_INFO}</div>
          <div className="font-bold mt-4">Сборка sedo:</div>
          <div>
            {direction.sedo &&
              `${direction.sedo?.commit}/${direction.sedo?.branches}`}
          </div>
          <div className="font-bold mt-4">Сборка apsd:</div>
          <div>
            {direction.apsd &&
              `${direction.apsd?.commit}/${direction.apsd?.branches}`}
          </div>
          <div className="font-bold mt-4">Сборка apsd:</div>
          <div>
            {direction.ts &&
            `${direction.ts?.commit}/${direction.ts?.branches}`}
          </div>
        </div>
        <FormContainer className="p-5 flex flex-col">
          <img
            src={LoginLogo}
            alt=""
            className="mb-11 h-min w-min"
            style={{ height: 'auto', width: '250px' }}
          />
          {children}
          <div className="mt-auto font-size-12 font-medium">
            <div className="mb-4 color-blue-1 font-bold">
              {direction.support?.message}
            </div>
            <div className="mb-4">{direction.support?.phone}</div>
            <div>{direction.support?.email}</div>
          </div>
        </FormContainer>
      </LoginFormContainer>
      <Background backgroundUrlPath={backgroundUrlPath} />
    </LoginContainer>
  )
}

LoginTemplate.propTypes = {
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  backgroundUrlPath: PropTypes.string.isRequired,
}

export default LoginTemplate
