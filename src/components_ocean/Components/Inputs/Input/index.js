import React, { useCallback, useMemo, forwardRef } from "react"
import PropTypes from "prop-types"
import {Container, Input } from "./styles"
import FillIndicator from './FillIndicator'

export { Container, Input }

const TextInput = forwardRef(({
 children, className, id, disabled, autoComplete, placeholder, name, type, onInput,
 onBlur, onFocus, onKeyUp, value, ShowInputFillIndicator, maxlength
}, ref) => {
  const InputType = useMemo(() => type === "password" ? "password" : "text", [type])

  const onChange = useCallback(({target: {value, id}}) => {
    onInput(value, id)
  }, [onInput]);

  return (
    <Container className={`${className} flex items-center justify-center`}>
      <FillIndicator
        value={value}
        ShowInputFillIndicator={ShowInputFillIndicator}
        maxlength={maxlength}
      >
        <Input
          id={id}
          ref={ref}
          type={InputType}
          value={value}
          maxLength={maxlength}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={onChange}
          onKeyUp={onKeyUp}
          name={name}
        />
      </FillIndicator>
      {children}
    </Container>
  )
})

TextInput.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  maxlength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  onKeyUp: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  ShowInputFillIndicator: PropTypes.bool,
}

TextInput.defaultProps = {
  value: "",
  autoComplete: "off",
  placeholder: "",
  className: "",
  ShowInputFillIndicator: true
}

export default TextInput
