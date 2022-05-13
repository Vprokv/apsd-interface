import React, {useMemo, useCallback} from "react"
import PropTypes from "prop-types"
import {BoxContainer, Box, CheckBoxContainer, CheckBoxLabel} from "./styles"

export {BoxContainer, Box, CheckBoxLabel, CheckBoxContainer}

function preventDoubleClick (e) {
  e.preventDefault()
  e.stopPropagation()
}

const CheckBox = ({
  value, returnObjects, disabled, label, checkBoxValue, valueKey,
  id, onBlur, onFocus, onInput, className, style
}) => {

  const normalizeCheckBoxVal = useMemo(
    () => checkBoxValue !== null && typeof checkBoxValue === "object" ? checkBoxValue[valueKey] : checkBoxValue,
    [checkBoxValue, valueKey]
  )

  const checked = useMemo(
    () => checkBoxValue && Array.isArray(value)
      ? value.some(val => (returnObjects ? val[valueKey] : val) === normalizeCheckBoxVal)
      : !!value,
    [checkBoxValue, value, valueKey, normalizeCheckBoxVal, returnObjects]
  )

  const updateValue = useCallback((e) => {
      onFocus()
      if (checkBoxValue) {
        onInput(
          checked
            ? value.filter(val => (typeof val === "object" ? val[valueKey] : val) !== normalizeCheckBoxVal)
            : [
              ...value || [],
              returnObjects
                ? typeof checkBoxValue === "object"
                  ? checkBoxValue
                  : {[valueKey]: normalizeCheckBoxVal}
                : normalizeCheckBoxVal
            ]
          , id)
      } else {
        onInput(!value, id)
      }
      onBlur()
    },
    [onFocus, onInput, checkBoxValue, normalizeCheckBoxVal, value, checked, valueKey, returnObjects, id, onBlur]
  )

  return (
    <CheckBoxContainer
      className={`${className} flex items-center`}
      style={style}
      disabled={disabled}
      type="button"
      onMouseDown={updateValue}
      onDoubleClick={preventDoubleClick}
      name={label}
    >
      <BoxContainer>
        <Box checked={checked}/>
      </BoxContainer>
      {label && (<CheckBoxLabel>{label}</CheckBoxLabel>)}
    </CheckBoxContainer>
  )
}

CheckBox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.bool, PropTypes.object]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  returnObjects: PropTypes.bool,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  checkBoxValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  valueKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onInput: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

CheckBox.defaultProps = {
  valueKey: "ID",
  onBlur: () => null,
  onFocus: () => null,
  className: "",
}

export default CheckBox
