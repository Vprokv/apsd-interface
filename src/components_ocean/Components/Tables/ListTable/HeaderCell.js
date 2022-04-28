import React from 'react';
import PropTypes from 'prop-types';

const HeaderCell = ({label}) => {
  return (
    <div className="whitespace-nowrap">
      {label}
    </div>
  );
};

HeaderCell.propTypes = {

};

export default HeaderCell;