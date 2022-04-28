import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { removeIcon } from "../../../Icons/removeIcon"
import Icon from "../../Icon"

import { MultipleOptionContainer } from "./styles"

const MultipleOption = ({ getLabel, disabled, onDeselectOption, index, value }) => {
  const handleDeselect = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    onDeselectOption(index)
  }, [index, onDeselectOption])
  return (
    <MultipleOptionContainer>
      { useMemo(() => getLabel(value), [getLabel, value]) }
      <button
        className="pointer-events-all"
        disabled={disabled}
        type="button"
        onMouseDown={handleDeselect}
      >
        <Icon
          icon={removeIcon}
          className="m-l-10"
          size="8"
        />
      </button>
    </MultipleOptionContainer>
  )
}

MultipleOption.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
  index: PropTypes.number.isRequired,
  getLabel: PropTypes.func.isRequired,
  onDeselectOption: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export default MultipleOption
