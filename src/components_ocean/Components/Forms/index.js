import React, {useCallback, useMemo, useRef} from "react"
import PropTypes from "prop-types"
import AccumulateFunctionCall from "../../Utils/FunctionCall/AccumulateFunctionCall"
import { ContainerContext } from "../../constants"
import DefaultInputWrapper from "./InputWrapper"
import ValidationUiState from "./InputWrapper/ValidationUiState";
import useWatch from "../../Utils/Hooks/useWatch";
import WithValidationHoc from "../../Logic/Validator/WithValidation";

const Form = ({
  onSubmit, children, id,
  formContainer: FormContainer, fields, value, rules, onInput, suffix, touched, onChange,
  changed, validationErrors, submitFailed, formHasSubmitted, inputWrapper, onFocus, onBlur, interceptors,
  style, className
}) => {
  const valueRef = useRef(value)
  const refFormContainer = useRef()
  valueRef.current = value

  const handleInput = useMemo(() => AccumulateFunctionCall((...args) => {
    onInput(args.reduce((acc, [value, id]) => {
      if (value === undefined) {
        delete acc[id]
      } else {
        acc[id] = value
      }
      return acc
    },
    { ...valueRef.current }))
    onChange()
  }, 10), [onChange, onInput])

  useWatch(value, (NextValue, PrevValue) => {
    for (const [key, handler] of interceptors) {
      if (NextValue[key] !== PrevValue[key]) {
        valueRef.current[key] = value
        handler({ value: value[key], prevValue: valueRef.current[key], handleInput, formPayload: value })
      }
    }
  })

  const handleSubmit = useCallback((e) => {
    if (e.preventDefault) {
      e.preventDefault()
      e.stopPropagation()
    }
    return onSubmit(valueRef.current)
  }, [onSubmit])

  return (
    <ContainerContext.Provider value={refFormContainer.current}>
      <FormContainer
        className={className}
        onSubmit={handleSubmit}
        id={id}
        ref={refFormContainer}
        style={style}
      >
        {fields.map(({ style, component: InputField, id, label, inputWrapper: IWrapper = inputWrapper, ...field }) => (
          <ValidationUiState
            key={id}
            validationRules={rules[id]}
            touched={touched[id]}
            changed={changed[id]}
            submitFailed={submitFailed}
            validationErrors={validationErrors[id]}
          >
            {({ hasError, isRequired }) => (
              <IWrapper
                {...field}
                style={style}
                id={id}
                suffix={suffix}
                hasError={hasError}
                isRequired={isRequired}
                validationRules={rules[id]}
                validationErrors={validationErrors[id]}
                touched={touched[id]}
                changed={changed[id]}
                submitFailed={submitFailed}
                formHasSubmitted={formHasSubmitted}
                formPayload={value}
                label={label}
              >
                <InputField
                  id={id}
                  label={label}
                  value={value[id]}
                  formPayload={value}
                  onInput={handleInput}
                  hasError={hasError}
                  isRequired={isRequired}
                  onFocus={onFocus(id)}
                  onBlur={onBlur(id)}
                  validationErrors={validationErrors[id]}
                  touched={touched[id]}
                  changed={changed[id]}
                  submitFailed={submitFailed}
                  formHasSubmitted={formHasSubmitted}
                  {...field}
                />
              </IWrapper>
            )}
          </ValidationUiState>
        ))}
        {children}
      </FormContainer>
    </ContainerContext.Provider>
  )
}

Form.propTypes = {
  onInput: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.bool,
  submitFailed: PropTypes.bool,
  formHasSubmitted: PropTypes.bool,
  inputWrapper: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  fields: PropTypes.array,
  suffix: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  rules: PropTypes.object,
  touched: PropTypes.object,
  changed: PropTypes.object,
  formContainer: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node]),
  interceptors: PropTypes.instanceOf(Map),
  validationErrors: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  style: PropTypes.object,
}

Form.defaultProps = {
  inputWrapper: DefaultInputWrapper,
  formContainer: "form",
  className: "",
  validationErrors: {},
  fields: [],
  interceptors: new Map(),
  touched: {},
  changed: {},
  value: {},
  rules: {},
  onInput: () => null,
  onChange: () => null,
  onFocus: () => () => null,
  onBlur: () => () => null,
}

export const WithWithValidationForm = WithValidationHoc(Form)

export default Form

