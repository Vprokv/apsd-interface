import React from 'react';
import PropTypes from 'prop-types';
import {SidebarContainer} from "./styles";
import DeleteIcon from './Group 846.svg'

const SideBar = props => {
  return (
    <SidebarContainer>
      <div className="flex items-center font-size-12">
        <img src={DeleteIcon} alt="" className="mr-2"/>
        Удалить
      </div>
    </SidebarContainer>
  );
};

SideBar.propTypes = {

};

export default SideBar;