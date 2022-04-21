import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@Components/Components/Icon'
import sortAngleIcon from '../../../Icons/sortAngleIcon'
import {Resizer} from "./styles";

const HeaderCell = ({label, onResize, onMove}) => {
  return (
    <div
      className="whitespace-nowrap font-size-12 color-text-secondary flex items-center py-3 relative"
      draggable
      onDragStart={onMove}
    >
      <div className="flex flex-col mr-1.5">
        <Icon icon={sortAngleIcon} size={8}/>
        <Icon icon={sortAngleIcon} size={8} className="rotate-180"/>
      </div>
      {label}
      <Resizer onMouseDown={onResize}/>
    </div>
  );
};

HeaderCell.propTypes = {

};

export default HeaderCell;