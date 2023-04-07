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
  const [support, setSupport] = useState({})

  useEffect(() => {
    ;(async () => {
      const [{ data: apsd }, { data: ts }, { data: sedo }] = await Promise.all([
        api.get(URL_REVISION_APSD),
        api.get(URL_REVISION_CHAT),
        api.get(URL_REVISION_SEDO),
      ])
      setDirection({ apsd, ts, sedo })
    })()
  }, [api])

  useEffect(() => {
    ;(async () => {
      const { data } = await axios.get('/settings.json')
      setSupport(data)
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
              `${direction.sedo?.commit}/ ${direction.sedo?.branch}`}
          </div>
          <div className="font-bold mt-4">Сборка apsd:</div>
          <div>
            {direction.apsd &&
              `${direction.apsd?.commit}/ ${direction.apsd?.branch}`}
          </div>
          <div className="font-bold mt-4">Сборка ts:</div>
          <div>
            {direction.ts && `${direction.ts?.commit}/ ${direction.ts?.branch}`}
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
            <div className="mb-4 color-blue-1 font-bold">{support.message}</div>
            <div className="mb-4">{support.phone}</div>
            <div>{support.email}</div>
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
