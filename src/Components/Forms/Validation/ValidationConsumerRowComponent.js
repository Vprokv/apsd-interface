import { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import { RowContainer } from '@Components/Components/Tables/ListTable/styles'
import { GetFieldValidationProps } from '@Components/Logic/Validator'

const ValidationConsumerRowComponent = ({ id, className, children }) => {
  const getFieldValidationProps = useContext(GetFieldValidationProps)
  return (
    <RowContainer className={className} id={id}>
      <GetFieldValidationProps.Provider
        value={useCallback(
          (fieldId) => getFieldValidationProps(`${id}.${fieldId}`),
          [getFieldValidationProps, id],
        )}
      >
        {children}
      </GetFieldValidationProps.Provider>
    </RowContainer>
  )
}

ValidationConsumerRowComponent.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default ValidationConsumerRowComponent
