import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Outlet } from "react-router-dom";
import Tab from '@Components/Logic/Tab'
import Header from "./Components/Header";
import SideBar from "./Components/SideBar";
import TabHeader from "./Components/Tab";
import {userAtom} from '@Components/Logic/UseTokenAndUserStorage'
import {useRecoilValue} from "recoil";
const Main = () => {
  const { r_object_id } = useRecoilValue(userAtom)
  return (
    <Tab userId={r_object_id} >
      {({ tabState: { tabs, currentTabIndex }, onOpenNewTab, onChangeActiveTab, onCloseTab }) => (
          <div className="flex-container ">
            <Header />
            <div className="flex h-full overflow-hidden">
              <SideBar onOpenNewTab={onOpenNewTab}/>
              <div className="flex-container w-full overflow-hidden">
                <div className="flex p-4">
                  {tabs.map(({name, id}, index) => (
                    <TabHeader
                      key={id}
                      active={index === currentTabIndex}
                      name={name}
                      onClick={() => onChangeActiveTab(index)}
                      onClose={() => onCloseTab(index)}
                      closeable={tabs.length > 1}
                    />
                  ))}
                </div>
                <Outlet />
              </div>
            </div>
          </div>
        )
      }
    </Tab>
  );
};

Main.propTypes = {

};

export default Main;
