import React from 'react'
import PropTypes from 'prop-types'
import { ContHover } from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'
import { GridContainer } from '@/Components/ListTableComponents/EmitValueRowComponent/styles'

const RowComponent = ({ className, children, style, onDoubleClick, value }) => {
  return (
    <GridContainer
      onDoubleClick={onDoubleClick(value)}
      className={className}
      style={style}
    >
      {children}
    </GridContainer>
  )
}

RowComponent.propTypes = {
  onDoubleClick: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  style: PropTypes.object,
}

export default RowComponent