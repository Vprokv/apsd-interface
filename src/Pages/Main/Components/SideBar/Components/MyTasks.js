import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {NavigationHeaderIcon} from "../style";
import NavigationDocumentIcon from "../icons/NavigationDocumentIcon";
import WithToggleNavigationItem from "./withToggleNavigationItem";
import angleIcon from "@/Icons/angleIcon";
import Icon from '@Components/Components/Icon'
import {TASK_LIST_PATH} from "../../../../../routePaths";
import {EXPIRED, EXPIRED_1_3, EXPIRED_4_7, EXPIRED_8, TabNames} from "../../../../Tasks/list/constants";

const MyTasks = ({ onOpenNewTab }) => {
  const handleOpenNewTab = useCallback((path) => () => onOpenNewTab(path), [onOpenNewTab])
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
              <button
                type="button"
                className="flex w-full py-1.5 color-blue-1"
                onClick={handleOpenNewTab(TASK_LIST_PATH)}
              >
                <span className="mr-auto">{TabNames[""]}</span>
                <span className="font-medium">23/45</span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${TASK_LIST_PATH}${EXPIRED}`)}
              >
                <span className="mr-auto">{TabNames[EXPIRED]}</span>
                <span className="color-red font-medium">14/23</span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${TASK_LIST_PATH}${EXPIRED_1_3}`)}
              >
                <span className="mr-auto">{TabNames[EXPIRED_1_3]}</span>
                <span>
                  <span className="font-medium">3</span>
                  <span className="color-text-secondary">/0</span>
                </span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${TASK_LIST_PATH}${EXPIRED_4_7}`)}
              >
                <span className="mr-auto">{TabNames[EXPIRED_4_7]}</span>
                <span>
                  <span className="font-medium">0</span>
                  <span className="color-text-secondary">/2</span>
                </span>
              </button>
              <button
                type="button"
                className="flex w-full py-1.5"
                onClick={handleOpenNewTab(`${TASK_LIST_PATH}${EXPIRED_8}`)}
              >
                <span className="mr-auto">{TabNames[EXPIRED_8]}</span>
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