import { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { FieldValidationStateContext } from '@/Components/InputWrapperRefactor/constants'
import {
  InputContainer,
  InputErrorContainer,
} from '@/Components/InputWrapperRefactor/RowInputWrapperRefactor'

const ValidationConsumer = ({ children, path, id }) => {
  const getErrors = useContext(FieldValidationStateContext)

  const error = useMemo(() => getErrors(path), [getErrors, path])
  return (
    <InputContainer className="relative flex" hasError={!!error}>
      {children}
      {error && <InputErrorContainer>{error}</InputErrorContainer>}
    </InputContainer>
  )
}

ValidationConsumer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  path: PropTypes.string.isRequired,
}

export default ValidationConsumer
