import React from 'react';
import PropTypes from 'prop-types';
import {Outlet, useLocation } from "react-router-dom";
import Tab from '@Components/Logic/Tab'
import Header from "./Components/Header";
import SideBar from "./Components/SideBar";
import history from '@/history'


const Main = () => {
  const location = useLocation()
  return (
    <Tab history={history} userId={1} location={location}>
      {(tabState) => (
        <div className="flex-container">
          <Header/>
          <div className="flex h-full">
            <SideBar/>
            <Outlet context={tabState} />
          </div>
        </div>
      )}
    </Tab>
  );
};

Main.propTypes = {

};

export default Main;
