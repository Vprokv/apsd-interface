import PropTypes from 'prop-types'

import { Resizer } from './styles'

const HeaderCell = ({ label, onResize, onMove, onContextMenu, id }) => {
  return (
    <div
      className="whitespace-nowrap font-size-12 color-text-secondary flex items-center py-3 relative w-full"
      onMouseDown={onMove}
      onContextMenu={onContextMenu}
    >
      <div id={id}>{label}</div>
      <Resizer onMouseDown={onResize} />
    </div>
  )
}

HeaderCell.propTypes = {
  label: PropTypes.string.isRequired,
  onResize: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
}

export default HeaderCell
