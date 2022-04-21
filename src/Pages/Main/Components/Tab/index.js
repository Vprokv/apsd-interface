import React from 'react';
import PropTypes from 'prop-types';
import {CloseIcon, Container} from "./styles";
import closeIcon from "../../../../Icons/closeIcon";

const Tab = ({ name, onClose }) => {
  return (
    <Container className="rounded-md flex items-center py-1 px-1.5 font-size-12 justify-center">
      {name}
      <CloseIcon icon={closeIcon} size={6} className="ml-1 text-white" onClick={onClose}/>
    </Container>
  );
};

Tab.propTypes = {

};

export default Tab;