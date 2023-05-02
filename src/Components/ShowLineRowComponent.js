import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export const GridContainer = styled.div`
  border-bottom: 1px solid #e6ebf4;
  display: flex;
  align-items: center;
  min-height: 50px;

  &:hover {
    background-color: #e3e9f8;
  }
`

const RowComponent = ({ children }) => {
  return <GridContainer>{children}</GridContainer>
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

RowComponent.defaultProps = {
  // todo в консоли ошибка что onDoubleClickа нет
  // обязателен ли он?
  onDoubleClick: () => null,
}

export default RowComponent
