import React from 'react';
import PropTypes from 'prop-types';

const DefaultRowComponent = ({ id, className, children }) => <div id={id} className={className}>
  {children}
</div>

DefaultRowComponent.propTypes = {

};

export default DefaultRowComponent;