import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  InputContainer,
  InputErrorContainer,
  InputLabel,
  InputLabelStart,
  InputRemarkErrorContainer,
  InputWrapperContainer,
} from './styles'

export {
  InputWrapperContainer,
  InputLabel,
  InputContainer,
  InputErrorContainer,
  InputLabelStart,
}

const RemarkWrapper = React.forwardRef(
  (
    {
      className,
      style,
      withoutLabel,
      id,
      label,
      validationErrors,
      children,
      hasError,
      isRequired,
      formPayload: { text = '' },
      validationRules,
      ...props
    },
    ref,
  ) => {
    const { max } = useMemo(
      () =>
        validationRules.reduce((acc, { name, args }) => {
          if (name === 'max') {
            acc = args
          }
          return acc
        }, {}),
      [validationRules],
    )

    const errorKey = useMemo(() => text.length > max, [max, text.length])

    return (
      <InputWrapperContainer
        className={`${className} flex items-center `}
        style={style}
        ref={ref}
        hasError={errorKey || hasError}
      >
        {!withoutLabel && (
          <InputLabel htmlFor={id}>
            {label} {isRequired && <InputLabelStart>*</InputLabelStart>}
          </InputLabel>
        )}
        <InputContainer className="flex flex-col flex-auto relative w-full">
          {children}
          <div className="flex">
            {hasError && (
              <InputRemarkErrorContainer
                hasError={hasError}
                className={'mr-auto'}
              >
                {validationErrors[0]}
              </InputRemarkErrorContainer>
            )}
            <InputRemarkErrorContainer
              hasError={errorKey}
              className={'ml-auto'}
            >
              {`${text.length}/${max}`}
            </InputRemarkErrorContainer>
          </div>
        </InputContainer>
      </InputWrapperContainer>
    )
  },
)

RemarkWrapper.propTypes = {
  withoutLabel: PropTypes.bool,
  suffix: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  validationErrors: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
}

RemarkWrapper.defaultProps = {
  className: '',
}

export default RemarkWrapper
