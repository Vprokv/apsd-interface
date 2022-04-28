import React from "react"
import PropTypes from "prop-types"
import { InputWrapperContainer, InputLabel, InputContainer, InputErrorContainer, InputLabelStart } from "./styles"

export { InputWrapperContainer, InputLabel, InputContainer, InputErrorContainer, InputLabelStart }

const DefaultInputWrapper = React.forwardRef(({
  className, style, withoutLabel, id, label, suffix, validationErrors, children, slotLabel, hasError, isRequired
}, ref) => {

  return (
    <InputWrapperContainer
      className={`${className} flex flex-col flex-auto`} style={style} ref={ref}
      hasError={hasError}
    >
      {!withoutLabel && (
      <InputLabel htmlFor={id}>
        { label } {isRequired && <InputLabelStart>*</InputLabelStart>}{ suffix }
        {slotLabel}
      </InputLabel>
      )}
      <InputContainer className="flex flex-col flex-auto relative w-full">
        {children}
        {hasError && (
        <InputErrorContainer>
          {validationErrors[0]}
        </InputErrorContainer>
        )}
      </InputContainer>
    </InputWrapperContainer>
  )
})

DefaultInputWrapper.propTypes = {
  withoutLabel: PropTypes.bool,
  suffix: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  validationErrors: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
}

DefaultInputWrapper.defaultProps = {
  className: "",
}

export default DefaultInputWrapper
