import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { SwitchBlock, SwitchLabel, ContainerSwitch, Circle } from "./styles"

export { SwitchBlock, SwitchLabel, ContainerSwitch, Circle }

const Switch = ({ id, label, value, onInput, className, style }) => (
  <SwitchBlock
    onClick={useCallback(() => { onInput(!value, id)}, [id, onInput, value])}
    className={className}
    style={style}
  >
    <ContainerSwitch>
      <Circle activeSwitch={value}/>
    </ContainerSwitch>
    <SwitchLabel>
      {label}
    </SwitchLabel>
  </SwitchBlock>
)


Switch.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
  onInput: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
}

export default Switch
