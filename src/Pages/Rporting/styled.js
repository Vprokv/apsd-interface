import styled from 'styled-components'
import Validation from '@Components/Logic/Validator/V'
import Form from '@Components/Components/Forms'
import InputWrapper, {
  InputLabel,
  InputLabelStart,
} from '@Components/Components/Forms/InputWrapper'

export const ContHover = styled.div`
  display: flex;
  height: 100%;
  opacity: 0;
`

export const LeafContainer = styled.div`
  &:hover {
    ${ContHover} {
      transition-duration: 0.5s;
      opacity: 1;
    }
  }
`

export const Message = styled.div`
  margin-top: 30px;
  font-size: 12px;
  background-color: black;
  color: white;
  position: absolute;
  //font-weight: 500;
  padding: 5px;
  z-index: 10;
  border-radius: 5px;
`

export const ReportsForm = styled(Form)`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 32px;
  padding: 1rem;
  --form-elements-indent: 0px;
  grid-row-gap: 20px;
`

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
