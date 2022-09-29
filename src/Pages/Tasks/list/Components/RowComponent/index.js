import React from 'react'
import PropTypes from 'prop-types'
import { GridContainer } from "./styles"

const RowComponent = ({ className, children, style, onDoubleClick, value: { id, type } }) => <GridContainer
  onDoubleClick={onDoubleClick(id, type)}
  id={id} className={className} style={style}
>
  {children}
</GridContainer>

RowComponent.propTypes = {
  onDoubleClick: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  style: PropTypes.object,
}

export default RowComponent