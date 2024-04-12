import React from 'react'
import RowInputWrapperUi from './RowInputWrapperUi'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const RowInputWrapper = React.forwardRef((props, ref) => {
  return (
    <WithValidationStateInputWrapper
      ref={ref}
      inputWrapperComponent={RowInputWrapperUi}
      {...props}
    />
  )
})

export default RowInputWrapper
