import React from 'react';
import PropTypes from 'prop-types';

import {Resizer} from "./styles";

const HeaderCell = ({label, onResize, onMove, onContextMenu}) => {
  return (
    <div
      className="whitespace-nowrap font-size-12 color-text-secondary flex items-center py-3 relative w-full"
      onMouseDown={onMove}
      onContextMenu={onContextMenu}
    >
      {label}
      <Resizer onMouseDown={onResize}/>
    </div>
  );
};

HeaderCell.propTypes = {

};

export default HeaderCell;