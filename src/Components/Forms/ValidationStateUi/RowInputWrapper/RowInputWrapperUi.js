import React from 'react'
import PropTypes from 'prop-types'
import { InputWrapperContainer } from './styles'

import { InputErrorContainer } from '@Components/Components/Forms/InputWrappers/InputWrapperUi'

const RowInputWrapperUi = React.forwardRef(
  (
    { className, style, id, label, validationErrors, children, isRequired },
    ref,
  ) => {
    return (
      <InputWrapperContainer
        className={`${className} flex flex-auto items-center font-size-14`}
        style={style}
        ref={ref}
        hasError={!!validationErrors}
      >
        <label className="flex-0 w-48 mr-6 " htmlFor={id}>
          {label} {isRequired && <span>*</span>}
        </label>
        <div className="flex flex-col flex-auto relative w-full">
          {children}
          {validationErrors && (
            <InputErrorContainer>{validationErrors}</InputErrorContainer>
          )}
        </div>
      </InputWrapperContainer>
    )
  },
)

RowInputWrapperUi.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  validationErrors: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  isRequired: PropTypes.bool,
}

RowInputWrapperUi.defaultProps = {
  className: '',
  style: {},
  hasError: false,
  isRequired: false,
}

export default RowInputWrapperUi
