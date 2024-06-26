import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import sortAngleIcon from '../../../Icons/sortAngleIcon'
import Icon from '@Components/Components/Icon'
import { SortStateContext } from '@Components/Components/Tables/Plugins/constants'
import { SortButton } from './styles'

const ModifiedSortCellComponent = (Component) => {
  const Cell = ({ className, style, id, ...props }) => {
    const {
      state: { key, direction },
      onChange,
      upperDirectionKey,
      downDirectionKey,
    } = useContext(SortStateContext)
    return (
      <div className={`${className} flex items-center`} style={style}>
        <div className="flex flex-col mr-1.5">
          <SortButton
            type="button"
            onClick={
              id === key && direction === 'ASC'
                ? () => null
                : () => onChange(id, upperDirectionKey)
            }
            current={direction === 'ASC' && id === key}
          >
            <Icon icon={sortAngleIcon} size={8} />
          </SortButton>
          <SortButton
            type="button"
            onClick={
              id === key && direction === 'DESC'
                ? () => null
                : () => onChange(id, downDirectionKey)
            }
            current={direction === downDirectionKey && id === key}
          >
            <Icon icon={sortAngleIcon} size={8} className="rotate-180" />
          </SortButton>
        </div>
        <Component id={id} {...props} />
      </div>
    )
  }

  Cell.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    id: PropTypes.string.isRequired,
  }

  Cell.defaultProps = {
    className: '',
  }

  return Cell
}

export default ModifiedSortCellComponent
