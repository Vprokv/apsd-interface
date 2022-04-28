import { useMemo } from "react"
import { VALIDATION_RULE_REQUIRED} from "../../../Logic/Validator/constants";
import PropTypes from "prop-types";

const ValidationUiState = ({ children, validationErrors, submitFailed, changed, touched, validationRules }) => {
  const hasError = useMemo(
    () => validationErrors.length > 0 && (submitFailed || (touched && changed)),
    [changed, submitFailed, touched, validationErrors]
  )

  const isRequired = useMemo(
    () => validationRules.some(({ name }) => name === VALIDATION_RULE_REQUIRED), [validationRules])

  return children({ hasError, isRequired })
}

ValidationUiState.propTypes = {
  children: PropTypes.func.isRequired,
  validationErrors: PropTypes.array,
  validationRules: PropTypes.array,
  submitFailed: PropTypes.bool,
  changed: PropTypes.bool,
  touched: PropTypes.bool,
}
ValidationUiState.defaultProps = {
  validationErrors: [],
  validationRules: [],
}

export default ValidationUiState
