import {useMemo} from "react"
import styled from "styled-components"
import ModalWindowComponent from '@Components/Components/ModalWindow'
import Icon from '@Components/Components/Icon'
import closeIcon from "../Icons/closeIcon"


const ModalWindow = styled(ModalWindowComponent)`
  background: #FFFFFF;
  border-radius: 16px;
  padding: 2rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
`

const ModalWindowWrapper = ({ title, ...props }) => (<ModalWindow
  {...props}
  closeIcon={useMemo(() => (props) => <div className="flex items-center mb-4">
    <span className="text-2xl font-medium">{title}</span>
    <Icon
      {...props}
      icon={closeIcon}
      size={14}
      className="ml-auto color-text-secondary"
    />
  </div>, [title])}
/>)

export default ModalWindowWrapper