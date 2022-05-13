import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import CheckBox from "../../../Inputs/CheckBox";
import {SelectStateContext} from "./constants";
import FlatSelect from './driver/FlatSelect'

export { FlatSelect }

const SelectablePlugin = (Component) => {
  const Selectable = ({ selectState, onSelect, settings, initialColumnState, ...props }) => {
    return <SelectStateContext.Provider
      value={useMemo(() => ({
      state: selectState,
      onChange: onSelect,
      value: props.value,
      valueKey: props.valueKey
    }), [onSelect, props.value, props.valueKey, selectState])}
    >
      <Component
        {...props}
        settings={useMemo(() => {
          const {columns, selectPlugin: { driver, ...columnSettings}, ...s} = settings

          return {
            ...s,
            columns: [
              driver({
                id: "selected",
                sizes: "40px",
                ...columnSettings
              }),
              ...columns
            ]
          }
        }, [settings])}
      />
    </SelectStateContext.Provider>;
  }
  Selectable.propTypes = {
    selectState: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    valueKey: PropTypes.string.isRequired,
  };

  return Selectable
};

export default SelectablePlugin;