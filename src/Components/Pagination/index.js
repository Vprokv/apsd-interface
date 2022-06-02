import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {PaginationButton} from "./styles";
import Icon from '@Components/Components/Icon'
import angleIcon from "../../Icons/angleIcon";
import doubleAngleIcon from "../../Icons/doubleAngleIcon";

const Pagination = ({ children, className, setLimit, limit }) => {
  const onSetLimit = useCallback((limit) => () => {
    setLimit(limit)
  }, [setLimit])
  return (
    <div className={`${className} flex item-center`}>
      <div className="flex item-center mr-auto">
        <PaginationButton
          className="mr-2"
          active={limit === 10}
          onClick={onSetLimit(10)}
        >
          10
        </PaginationButton>
        <PaginationButton
          className="mr-2"
          active={limit === 25}
          onClick={onSetLimit(25)}
        >
          25
        </PaginationButton>
        <PaginationButton
          className="mr-2"
          active={limit === 50}
          onClick={onSetLimit(50)}
        >
          50
        </PaginationButton>
        <PaginationButton
          className="mr-2"
          active={limit === 100}
          onClick={onSetLimit(100)}
        >
          100
        </PaginationButton>
      </div>
      <div className="flex items-center justify-center color-text-secondary">
          <Icon icon={doubleAngleIcon} className="rotate-180 mr-1.5"/>
          <Icon icon={angleIcon} className="rotate-90 mr-1.5" size={11}/>
        <PaginationButton
          className="mr-1.5"
          active
        >
          1
        </PaginationButton>
          <Icon icon={angleIcon} size={11} className="mr-1.5 rotate-270"/>
          <Icon icon={doubleAngleIcon}/>
      </div>
      <div className="ml-auto color-text-secondary font-size-12">
        {children}
      </div>
    </div>
  );
};

Pagination.propTypes = {
  className: PropTypes.string,
};

Pagination.defaultProps = {
  className: ""
};

export default Pagination;