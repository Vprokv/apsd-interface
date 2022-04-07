import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@Components/Components/Icon'
import calendarIcon from '../../../Icons/calendarIcon'
import clockIcon from '../../../Icons/clockIcon'

const DocumentState = ({ ParentValue: { status, dateStart, dateEnd } }) => {
  return (
    <div >
      <div className="font-size-14 mb-1 font-medium" >{status}</div>
      <div className="flex items-center font-size-12">
        <div className="flex items-center justify-center mr-2">
          <Icon icon={calendarIcon} className="mr-1 color-text-secondary" size={14}/>
          {dateStart}
        </div>
        <div className="flex items-center justify-center ">
          <Icon icon={clockIcon} className="mr-1 color-text-secondary" size={14}/>
          {dateEnd}
        </div>
      </div>
    </div>
  );
};

DocumentState.propTypes = {

};

export default DocumentState;

export const sizes = {
  min: "200px",
  max: "2.7fr"
}