import React from 'react';
import PropTypes from 'prop-types';
import {NavigationHeaderIcon, SideBarContainer} from "./style";
import Button from "@/Components/Button";
import Icon from '@Components/Components/Icon'
import plusIcon from "@/Icons/plusIcon";
import MyTasks from "./Components/MyTasks";
import ViewedIcon from "./icons/ViewedIcon";
import CreatedByMeIcon from "./icons/CreatedByMeIcon";
import Storage from "./Components/Storage";
import Archive from "./Components/Archive";
import Basket from "./Components/Basket";

const SideBar = ({ onOpenNewTab }) => {
  return (
    <SideBarContainer className="px-2 py-4 bg-light-gray flex-container">
      <Button className="text-white bg-blue-1 w-full flex items-center capitalize mb-4 rounded-lg">
        <Icon className="mr-2 ml-auto" icon={plusIcon} size={14}/>
        <span className="mr-auto">Создать</span>
      </Button>
      <MyTasks onOpenNewTab={onOpenNewTab} />
      <div className="flex items-center w-full mb-6">
        <NavigationHeaderIcon className="mr-2" icon={ViewedIcon} size={22}/>
        <div className="font-size-14 mr-auto font-medium">Просмотренные</div>
      </div>
      <div className="flex items-center w-full mb-6">
        <NavigationHeaderIcon className="mr-2" icon={CreatedByMeIcon} size={22}/>
        <div className="font-size-14 mr-auto font-medium">Созданные мной</div>
      </div>
      <Storage/>
      <Archive/>
      <Basket onOpenNewTab={onOpenNewTab} />
    </SideBarContainer>
  );
};

SideBar.propTypes = {
  onOpenNewTab: PropTypes.func.isRequired,
};

export default SideBar;