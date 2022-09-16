import React, {useContext, useMemo} from 'react';
import PropTypes from 'prop-types';
import {CustomValuesContext} from "../constants";
import Select from "@/Components/Inputs/Select";
import UserSelect from "@/Components/Inputs/UserSelect";

const WithCustomValuesSelect = (Component) => {
  const CustomValuesSelect = props => {
    const customValues = useContext(CustomValuesContext)
    return (
      <Component {...props} options={useMemo(() => {
        const v = customValues[props.id]
        return v ? Array.isArray(v) ? v : [v] : []
      }, [customValues, props.id])}/>
    );
  };

  CustomValuesSelect.propTypes = {
    id: PropTypes.string.isRequired,
  };

  return CustomValuesSelect
}


export const CustomValuesSelect = WithCustomValuesSelect(Select);
export const CustomValuesOrgStructure = WithCustomValuesSelect(UserSelect);