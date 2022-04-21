import React from 'react';
import PropTypes from 'prop-types';


const BaseCell = ({ value, className }) => {
  return (
    <div className={`${className} word-wrap-anywhere font-size-14`}>
      {value}
    </div>
  );
};

BaseCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

BaseCell.defaultProps = {
  className: ""
};

export default BaseCell;

export const sizes = {
  min: "150px",
  max: "2fr"
}