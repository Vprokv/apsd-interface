import { FormInputWrapper } from '@Components/Components/Forms'
import StyledInputWrapper from './StyledInputWrapper'

export const DefaultInputWrapper = (props) => (
  <FormInputWrapper {...props} inputWrapperComponent={StyledInputWrapper} />
)
