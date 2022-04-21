import React from 'react';
import PropTypes from 'prop-types';
import {Outlet, useLocation } from "react-router-dom";
import Tab from '@Components/Logic/Tab'
import Header from "./Components/Header";
import SideBar from "./Components/SideBar";
import TabHeader from "./Components/Tab";
import history from '@/history'

const mock = ["Все документы"]

const Main = () => {
  const location = useLocation()
  return (
    <Tab history={history} userId={1} location={location}>
      {(tabState) => (
        <div className="flex-container ">
          <Header/>
          <div className="flex h-full overflow-hidden">
            <SideBar/>
            <div className="flex-container w-full overflow-hidden">
              <div className="flex p-4">
                {mock.map((item) => (
                  <TabHeader key={item} name={item}/>
                ))}
              </div>
              <Outlet context={tabState} />
            </div>
          </div>
        </div>
      )}
    </Tab>
  );
};

Main.propTypes = {

};

export default Main;
