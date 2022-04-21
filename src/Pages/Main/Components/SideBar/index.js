import React from 'react';
import PropTypes from 'prop-types';
import {SideBarContainer} from "./style";
import Button from "@/Components/Button";
import Icon from '@Components/Components/Icon'
import plusIcon from "@/Icons/plusIcon";
import MyTasks from "./Components/MyTasks";

const SideBar = props => {
  return (
    <SideBarContainer className="px-2 py-4 bg-light-gray flex-container">
      <Button className="text-white bg-blue-1 w-full flex items-center capitalize mb-4">
        <Icon className="mr-2 ml-auto" icon={plusIcon} size={14}/>
        <span className="mr-auto">Создать</span>
      </Button>
      <MyTasks />
    </SideBarContainer>
  );
};

SideBar.propTypes = {};

export default SideBar;