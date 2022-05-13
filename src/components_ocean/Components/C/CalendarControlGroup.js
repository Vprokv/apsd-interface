import React from 'react';
import PropTypes from 'prop-types';
import {NavigationButton, NavigationButtonsContainer, NavigationLabel} from "./styles";
import Icon from "../Icon";
import { doubleLeftChevron } from "./icons/doubleLeftChevron"
import {doubleRightChevron} from "./icons/doubleRightChevron"
import { leftChevron } from "./icons/leftChevron"
import { rightChevron } from "./icons/rightChevron"

export const SINGLE = "singe"
export const DOUBLE = "double"
export  { NavigationButton, NavigationLabel }

const CalendarControlGroup = ({ disabled, calendarLabel, onNavigation, onChangeView }) => {
  return (
    <NavigationButtonsContainer className="no-white-space">
      <>
        <NavigationButton
          type="button"
          onClick={onNavigation(DOUBLE, false)}
        >
          <Icon icon={doubleLeftChevron}/>
        </NavigationButton>
        <NavigationButton
          type="button"
          onClick={onNavigation(SINGLE, false)}
        >
          <Icon icon={leftChevron}/>
        </NavigationButton>
      </>
      <NavigationLabel
        type="button"
        disabled={disabled}
        onClick={onChangeView}
      >
        {calendarLabel}
      </NavigationLabel>
      <>
        <NavigationButton
          type="button"
          onClick={onNavigation(SINGLE, true)}
        >
          <Icon icon={rightChevron}/>
        </NavigationButton>
        <NavigationButton
          type="button"
          onClick={onNavigation(DOUBLE, true)}
        >
          <Icon icon={doubleRightChevron}/>
        </NavigationButton>
      </>
    </NavigationButtonsContainer>
  );
};

CalendarControlGroup.propTypes = {
  disabled: PropTypes.bool,
  calendarLabel: PropTypes.string.isRequired,
  onNavigation: PropTypes.func.isRequired,
  onChangeView: PropTypes.func.isRequired,
};

export default CalendarControlGroup;