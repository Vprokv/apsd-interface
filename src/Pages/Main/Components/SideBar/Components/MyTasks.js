import React from 'react';
import PropTypes from 'prop-types';
import {NavigationHeaderIcon} from "../style";
import NavigationDocumentIcon from "../icons/NavigationDocumentIcon";
import WithToggleNavigationItem from "./withToggleNavigationItem";
import angleIcon from "@/Icons/angleIcon";
import Icon from '@Components/Components/Icon'

const MyTasks = () => {
  return (
    <WithToggleNavigationItem id="Мои задания">
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className="mb-4">
          <button className="flex items-center w-full" onClick={toggleDisplayedFlag}>
            <NavigationHeaderIcon
              icon={NavigationDocumentIcon}
              size={24}
            />
            <span className="font-size-14 mr-auto font-medium">Мои задания</span>
            <Icon icon={angleIcon} size={10} className={isDisplayed ? "" : "rotate-180"}/>
          </button>
          {isDisplayed && (
            <div className="font-size-12 mt-2">
              <button type="button" className="flex w-full py-1.5 color-blue-1">
                <span className="mr-auto">Все задания</span>
                <span className="font-medium">23/45</span>
              </button>
              <button type="button" className="flex w-full py-1.5">
                <span className="mr-auto">Срок истек</span>
                <span className="color-red font-medium">14/23</span>
              </button>
              <button type="button" className="flex w-full py-1.5">
                <span className="mr-auto">Срок через 1-3 дня</span>
                <span>
                  <span className="font-medium">3</span>
                  <span className="color-text-secondary">/0</span>
                </span>
              </button>
              <button type="button" className="flex w-full py-1.5">
                <span className="mr-auto">Срок через 4-7 дней</span>
                <span>
                  <span className="font-medium">0</span>
                  <span className="color-text-secondary">/2</span>
                </span>
              </button>
              <button type="button" className="flex w-full py-1.5">
                <span className="mr-auto">Срок больше недели</span>
                <span>
                  <span className="font-medium">7</span>
                  <span className="color-text-secondary">/9</span>
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </WithToggleNavigationItem>
  );
};

MyTasks.propTypes = {

};

export default MyTasks;