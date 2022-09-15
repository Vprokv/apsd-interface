import React, {useContext, useMemo} from 'react';
import PropTypes from 'prop-types';
import {CustomValuesContext} from "../constants";
import Select from "@/Components/Inputs/Select";

const CustomValuesSelect = props => {
  const customValues = useContext(CustomValuesContext)
  return (
    <Select {...props} options={useMemo(() => {
      const v = customValues[props.id]
      return Array.isArray(v) ? v : [v]
    }, [customValues, props.id])}/>
  );
};

CustomValuesSelect.propTypes = {
  id: PropTypes.string.isRequired,
};

export default CustomValuesSelect;