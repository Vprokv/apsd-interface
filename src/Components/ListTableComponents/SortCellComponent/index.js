import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import sortAngleIcon from '../../../Icons/sortAngleIcon'
import Icon from '@Components/Components/Icon'
import { SortStateContext } from '@Components/Components/Tables/Plugins/constants'
import {SortButton} from "./styles";

const SortCellComponent = (Component) => {
  const Cell = ({ className, style, id, ...props}) => {
    const { state: { key, direction }, onChange } = useContext(SortStateContext)
    return (
      <div className={`${className} flex items-center`} style={style} >
        <div className="flex flex-col mr-1.5">
          {(id !== key || direction !== "DSC") && <SortButton
            type="button"
            onClick={() => onChange(id, "ASC")}
            current={direction === "ASC" && id === key}
          >
            <Icon
              icon={sortAngleIcon}
              size={8}
            />
          </SortButton>}
          {(id !== key || direction !== "ASC") && <SortButton
            type="button"
            onClick={() => onChange(id, "DSC")}
            current={direction === "DSC" && id === key}
          >
            <Icon
              icon={sortAngleIcon}
              size={8}
              className="rotate-180"
            />
          </SortButton>}
        </div>
        <Component id={id} {...props}/>
      </div>
    );
  };

  Cell.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    id: PropTypes.string.isRequired,
  };

  Cell.defaultProps = {
    className: ""
  };

  return Cell
}

export default SortCellComponent;