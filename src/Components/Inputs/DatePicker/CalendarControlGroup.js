import React from 'react'
import PropTypes from 'prop-types'
import {
  NavigationElementContainer,
  NavigationElementController,
  Separator,
} from './styles'
import Icon from '@Components/Components/Icon'
import arrow from './icons/arrowUp'
import log from "tailwindcss/lib/util/log";

const CalendarControlGroup = ({
  currentMonth,
  currentYear,
  onNavigationMonth,
  onNavigationYear,
  monthDictionary,
}) => {
  return (
    <NavigationElementContainer className="flex">
      <NavigationElementController>
        <div className="font-bold font-size-14">
          {monthDictionary[currentMonth]}
        </div>
        <div className="flex items-center justify-center color-text-secondary">
          <button type="button" onClick={onNavigationMonth(false)}>
            <Icon icon={arrow} />
          </button>
          <button type="button" onClick={onNavigationMonth(true)}>
            <Icon icon={arrow} className="rotate-180" />
          </button>
        </div>
      </NavigationElementController>
      <Separator />
      <NavigationElementController>
        <div className="font-bold font-size-14">{currentYear}</div>
        <div className="flex items-center justify-center color-text-secondary">
          <button type="button" onClick={onNavigationYear(false)}>
            <Icon icon={arrow} />
          </button>
          <button type="button" onClick={onNavigationYear(true)}>
            <Icon icon={arrow} className="rotate-180" />
          </button>
        </div>
      </NavigationElementController>
    </NavigationElementContainer>
  )
}

CalendarControlGroup.propTypes = {
  onNavigationMonth: PropTypes.func.isRequired,
  onNavigationYear: PropTypes.func.isRequired,
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  monthDictionary: PropTypes.array,
}

CalendarControlGroup.defaultProps = {
  monthDictionary: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
}

export default CalendarControlGroup
