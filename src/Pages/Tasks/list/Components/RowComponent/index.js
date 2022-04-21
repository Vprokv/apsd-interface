import React from 'react';
import PropTypes from 'prop-types';
import { GridContainer } from "./styles";

const RowComponent = ({ id, className, children, style, onDoubleClick }) => <GridContainer
  onDoubleClick={onDoubleClick}
  id={id} className={className} style={style}
>
  {children}
</GridContainer>

RowComponent.propTypes = {
  onDoubleClick: PropTypes.func.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  style: PropTypes.object,
};

export default RowComponent;