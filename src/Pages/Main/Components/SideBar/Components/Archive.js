import React from 'react'
import PropTypes from 'prop-types'
import {NavigationHeaderIcon} from "../style"
import ArchiveIcon from "../icons/ArchiveIcon"
import WithToggleNavigationItem from "./withToggleNavigationItem"
import angleIcon from "@/Icons/angleIcon"
import Icon from '@Components/Components/Icon'

const Storage = props => {
  return (
    <WithToggleNavigationItem id="Архив">
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className="mb-4">
          <button className="flex items-center w-full " onClick={toggleDisplayedFlag}>
            <NavigationHeaderIcon
              icon={ArchiveIcon}
              size={24}
            />
            <span className="font-size-14 mr-auto font-medium">Архив</span>
            <Icon icon={angleIcon} size={10} className={isDisplayed ? "" : "rotate-180"}/>
          </button>
          {isDisplayed && (
            <>
              <WithToggleNavigationItem id="Архив_Восточные электрические сети">
                {({ isDisplayed, toggleDisplayedFlag }) => (
                  <div className="font-size-12 mt-2 pl-2">
                    <button
                      type="button"
                      className="flex w-full py-1.5"
                      onClick={toggleDisplayedFlag}
                    >
                      <span className="mr-auto">Восточные электрические сети</span>
                      <Icon icon={angleIcon} size={10} className={`color-text-secondary ${isDisplayed ? "" : "rotate-180"}`}/>
                    </button>
                    {isDisplayed && <WithToggleNavigationItem id='Архив_Строительство ПС "Красково"'>
                      {({ isDisplayed, toggleDisplayedFlag }) => (<div className="font-size-12 mt-2 pl-2">
                        <button
                          type="button"
                          className="flex w-full py-1.5"
                          onClick={toggleDisplayedFlag}
                        >
                          <span className="mr-auto">Строительство ПС "Красково"</span>
                          <Icon icon={angleIcon} size={10} className={`color-text-secondary ${isDisplayed ? "" : "rotate-180"}`}/>
                        </button>
                        {isDisplayed && <div className="font-size-12 mt-2 pl-2">
                          <button type="button" className="flex w-full py-1.5">
                            <span className="mr-auto">Схема ДЭП</span>
                          </button>
                        </div>}
                    </div>)}
                    </WithToggleNavigationItem>}
                  </div>
                )}
              </WithToggleNavigationItem>
              <WithToggleNavigationItem id="Архив_Новая Москва">
                {({ isDisplayed, toggleDisplayedFlag }) => (
                  <div className="font-size-12 mt-2 pl-2">
                    <button
                      type="button"
                      className="flex w-full py-1.5"
                      onClick={toggleDisplayedFlag}
                    >
                      <span className="mr-auto">Новая Москва</span>
                      <Icon icon={angleIcon} size={10} className={`color-text-secondary ${isDisplayed ? "" : "rotate-180"}`}/>
                    </button>
                    {isDisplayed && <WithToggleNavigationItem id='Архив_Строительство Новая Москва'>
                      {({ isDisplayed, toggleDisplayedFlag }) => (<div className="font-size-12 mt-2 pl-2">
                        <button
                          type="button"
                          className="flex w-full py-1.5"
                          onClick={toggleDisplayedFlag}
                        >
                          <span className="mr-auto">Строительство Новая Москва</span>
                          <Icon icon={angleIcon} size={10} className={`color-text-secondary ${isDisplayed ? "" : "rotate-180"}`}/>
                        </button>
                        {isDisplayed && <div className="font-size-12 mt-2 pl-2">
                          <button type="button" className="flex w-full py-1.5">
                            <span className="mr-auto">Схема ДЭП</span>
                          </button>
                        </div>}
                      </div>)}
                    </WithToggleNavigationItem>}
                  </div>
                )}
              </WithToggleNavigationItem>
            </>
          )}
        </div>
      )}
    </WithToggleNavigationItem>
  )
}

Storage.propTypes = {
  
}

export default Storage