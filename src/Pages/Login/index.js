import React from 'react';
import PropTypes from 'prop-types';
import TextInput from "../../../components_ocean/Components/Input";

import { LoginContainer, LoginFormContainer, Background } from "./styles";

const Login = props => {
  return (
    <LoginContainer>
      <LoginFormContainer>
        <TextInput />
      </LoginFormContainer>
      <Background/>
    </LoginContainer>
  );
};

Login.propTypes = {
  
};

export default Login;