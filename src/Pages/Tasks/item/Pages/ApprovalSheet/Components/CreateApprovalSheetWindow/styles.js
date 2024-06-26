import styled from 'styled-components'
import ModalWindowWrapper from '@/Components/ModalWindow'

export const CustomSizeModalWindow = styled(ModalWindowWrapper)`
  width: 60.6%;
  //height: 90.65%;
  margin: auto;
`
export const LeafContainer = styled.div`
  background: inherit;
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => (props.level ? '10px' : '0')};
  //border-bottom: ${(props) => (props.level === 0 ? '1px solid' : '')};
  padding: 2px;
  border-radius: 4px;
  ${(props) =>
    props.selected ? 'background: var(--color-selected-leaf, #EFE4C5);' : ''}
  ${(props) =>
    props.level === 2
      ? `
          padding-left: 2px;
          margin-left: 10px;
          `
      : ''}
`

export const HeaderContainer = styled.div`
  border-bottom: 1px solid var(--separator);
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: ${(props) =>
    props.level === 0 ? ' var(--notifications)' : ''};
`
export const ChildrenContainer = styled.div`
  z-index: 1;
`
