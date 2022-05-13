import React, {useContext, useRef} from "react"
import PropTypes from "prop-types"
import { YearViewContainer, YearItem } from "./styles"
import {SelectView} from "./constants";
import { MONTH } from "./useCalendarViewController";
import UseCalcCalendarItemHeight from "./useCalcCalendarItemHeight";

const YearView = ({ monthNames }) => {
  const onSelect = useContext(SelectView)
  const refDaysContainer = useRef()
  const itemStyles = UseCalcCalendarItemHeight(refDaysContainer)
  return (
    <YearViewContainer ref={refDaysContainer}>
      {monthNames.map((month, index) => (
        <YearItem
          type="button"
          key={month}
          onClick={onSelect(MONTH, index)}
          style={itemStyles}
        >
          { month }
        </YearItem>
      ))}
    </YearViewContainer>
  )
}

YearView.propTypes = {
  monthNames: PropTypes.array,
}

YearView.defaultProps = {
  monthNames: [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
  ]
};

export default YearView
