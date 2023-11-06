import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ContHover } from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'

const RowTableComponent = styled.div`
  &:hover {
    ${ContHover} {
      --cont-hover-opacity: 1;
    }

    background-color: #e3e9f8;
  }
`

const RowComponent = ({ className, children, style, onDoubleClick, value }) => (
  <RowTableComponent
    onDoubleClick={onDoubleClick(value)}
    className={className}
    style={style}
  >
    {children}
  </RowTableComponent>
)

RowComponent.propTypes = {
  onDoubleClick: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  style: PropTypes.object,
  value: PropTypes.object,
}

export default RowComponent
