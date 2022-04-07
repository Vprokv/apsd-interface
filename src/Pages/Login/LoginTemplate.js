import React from 'react'
import PropTypes from 'prop-types'
import LoginLogo from './Login_logo.png'
import {LoginContainer, LoginFormContainer, Background} from './styles'



function LoginTemplate({ children, backgroundUrlPath }) {
  return (
    <LoginContainer >
      <LoginFormContainer className="p-5 flex flex-col">
        <img src={LoginLogo} alt="" className="mb-11 h-min w-min"/>
        {children}
        <div className="mt-auto font-size-14 font-medium">
          <div className="mb-4">
            Тел.: +7(495) 646-73-17
          </div>
          <div>
            E-mail: support@rossetmir.ru
          </div>
        </div>
      </LoginFormContainer>
      <Background backgroundUrlPath={backgroundUrlPath}/>
    </LoginContainer>
  )
}

LoginTemplate.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
}

export default LoginTemplate
