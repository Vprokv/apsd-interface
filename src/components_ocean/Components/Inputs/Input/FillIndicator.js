import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import { InputFillIndicator } from "./styles";

const FillIndicator = ({ value, maxlength, children, ShowInputFillIndicator }) => {
  const UnderlineStyles = useMemo(() => ({
    width: `${(value?.length / Number(maxlength)) * 100}%`
  }), [maxlength, value])

  return (
    <div className="relative flex-auto h-full">
      {children}
      {ShowInputFillIndicator && (
        <InputFillIndicator
          style={UnderlineStyles}
        />
      )}
    </div>
  );
};

FillIndicator.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  maxlength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  ShowInputFillIndicator: PropTypes.bool,
}

FillIndicator.defaultProps = {
  value: "",
  maxlength: 0,
  ShowInputFillIndicator: true
}

export default FillIndicator;