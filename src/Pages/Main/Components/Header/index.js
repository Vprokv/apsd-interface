import React from 'react';
import PropTypes from 'prop-types';
import MainLogo from '../../main_logo.png'
import Icon from '@Components/Components/Icon'
import doubleAngleIcon from "@/Icons/doubleAngleIcon";
import settingsIcon from "@/Icons/settingsIcon";
import searchIcon from "@/Icons/searchIcon";
import notificationIcon from "@/Icons/notificationIcon";
import angleIcon from "@/Icons/angleIcon";
import {Avatar, IconsGroup} from "./styles";
import tempImg from './temp_avatar.png'



const Header = props => {
  return (
    <div className="bg-blue-1 flex items-center py-4 pl-6 pr-5">
      <img src={MainLogo} className="mr-20"/>
      <button
        type="button"
        className="bg-blue-4 p-2 rounded-md"
      >
        <Icon icon={doubleAngleIcon}/>
      </button>
      <IconsGroup className="ml-auto flex items-center justify-center relative pr-5 py-2.5">
        <Icon className="mr-5" icon={settingsIcon}/>
        <Icon className="mr-5" icon={searchIcon}/>
        <Icon icon={notificationIcon}/>
      </IconsGroup>
      <div className="pl-10 text-white flex items-center">
        <div className="text-right mr-4 font-medium">
          <div>Михаил</div>
          <div>Медведев</div>
        </div>
        <Avatar className="mr-2" src={tempImg}/>
        <Icon icon={angleIcon}/>
      </div>
    </div>
  );
};

Header.propTypes = {
  
};

export default Header;