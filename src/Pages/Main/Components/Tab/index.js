import React from 'react';
import PropTypes from 'prop-types';
import {CloseIcon, Container} from "./styles";
import closeIcon from "../../../../Icons/closeIcon";

const Tab = ({ name, onClose, active, onClick, closeable }) => {
  const handleClose = (e) => {
    e.stopPropagation()
    onClose()
  }
  return (
    <Container
      active={active}
      className="rounded-md flex items-center py-1 px-1.5 font-size-12 justify-center mr-1"
      onClick={onClick}
    >
      {name}
      {closeable &&  <CloseIcon icon={closeIcon} size={6} className="ml-1 text-white" onClick={handleClose}/>}
    </Container>
  );
};

Tab.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string,
  active: PropTypes.bool,
  closeable: PropTypes.bool,
};

export default Tab;