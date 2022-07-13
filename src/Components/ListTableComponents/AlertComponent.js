import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import Icon from '@Components/Components/Icon'
import warningIcon from '../../Icons/warningIcon'

const OrangeIcon = styled(Icon)`
  color: #FA9312;
  align-self: center;
  justify-self: center;
`

const AlertComponent = () => {
  return (
    <OrangeIcon icon={warningIcon}/>
  );
};

AlertComponent.propTypes = {

};

export default AlertComponent;

export const sizes = 60