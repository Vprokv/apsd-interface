import React from 'react';
import PropTypes from 'prop-types';
import {SidebarContainer} from "./styles";
import DeleteIcon from './Group 846.svg'
import SaveIcon from './SaveIcon.svg'
import Button from "@/Components/Button";

const SideBar = props => {
  return (
    <SidebarContainer>
      <Button>
        <div className="flex items-center font-size-12">
          <img src={SaveIcon} alt="" className="mr-2"/>
          Сохранить
        </div>
      </Button>
      <Button>
        <div className="flex items-center font-size-12">
          <img src={DeleteIcon} alt="" className="mr-2"/>
          Удалить
        </div>
      </Button>
    </SidebarContainer>
  );
};

SideBar.propTypes = {};

export default SideBar;