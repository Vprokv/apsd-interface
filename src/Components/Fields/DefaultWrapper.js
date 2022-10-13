import styled from 'styled-components'
import InputWrapper, {
  InputLabel,
  InputLabelStart,
} from '@Components/Components/Forms/InputWrapper'

export default styled(InputWrapper)`
  font-size: 14px;
  font-weight: 400;

  ${InputLabel} {
    margin-bottom: 4px;
    color: #232832;
  }

  ${InputLabelStart} {
    color: #1c60e0;
    font-weight: 500;
  }
`
