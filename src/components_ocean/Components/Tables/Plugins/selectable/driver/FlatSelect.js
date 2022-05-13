/* eslint-disable react-hooks/rules-of-hooks */
import {useCallback, useContext, useMemo} from "react";
import {SelectStateContext} from "../constants";

const FlatSelect = ({component: Comp, ...settings}) => ({
  ...settings,
  headerCellComponent: (props) => {
    const { state, onChange, value, valueKey } = useContext(SelectStateContext)
    return <Comp
      {...props}
      value={useMemo(() => value.every(v => state.includes(v[valueKey])), [state, value, valueKey])}
      onInput={useCallback((v) => onChange(v ? [...new Set([...state, ...value.map(v => v[valueKey])])] : []), [onChange, state, value, valueKey])}
    />
  },
  component: (props) => {
    const { state, onChange, valueKey } = useContext(SelectStateContext)
    return <Comp
      {...props}
      value={state}
      checkBoxValue={props.rowValue[valueKey]}
      onInput={onChange}
    />
  }
})

export default FlatSelect