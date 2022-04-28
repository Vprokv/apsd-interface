import React, {useCallback, useContext, useMemo, useRef} from "react"
import PropTypes from "prop-types"
import { YearViewContainer, YearItem } from "./styles"
import {SelectView} from "./constants";
import { YEAR } from "./useCalendarViewController";
import UseCalcCalendarItemHeight from './useCalcCalendarItemHeight'

const DecadeView = ({ currentYear }) => {
  const onSelect = useContext(SelectView)
  const endOfDecade = useMemo(() => Math.ceil(currentYear / 10) * 10, [currentYear])
  const refDaysContainer = useRef()
  const itemStyles = UseCalcCalendarItemHeight(refDaysContainer)

  const decadeItems = []
  for (let i = 1; i < 11; i++) {
    const year = endOfDecade - 10 + i
    decadeItems.push(
      <YearItem
        type="button"
        key={i}
        onClick={onSelect(YEAR, year)}
        style={itemStyles}
      >
        { year }
      </YearItem>
    )
  }
  return (
    <YearViewContainer ref={refDaysContainer}>
      {decadeItems}
    </YearViewContainer>
  )
}

DecadeView.propTypes = {
  onSelect: PropTypes.func.isRequired,
  currentYear: PropTypes.number.isRequired
}

export default DecadeView
