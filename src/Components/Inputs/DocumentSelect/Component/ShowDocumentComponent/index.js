import { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import DocumentShowIcon from '@/Icons/DocumentShowIcon'
import styled from 'styled-components'
import { TabStateManipulation } from '@Components/Logic/Tab'
import Tips from '@/Components/Tips'
import Icon from '@Components/Components/Icon'

export const ShowDocumentButton = styled.button.attrs({ type: 'button' })`
  background-color: var(--light-blue);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: var(--form--elements_height);
  width: var(--form--elements_height);
  min-width: var(--form--elements_height);

  &:disabled {
    background: var(--text-secondary);
    color: var(--form-elements-border-color);
  }
`

const ShowDocumentComponent = ({ selectedState }) => {
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)

  const handleClick = useCallback(
    () =>
      openTabOrCreateNewTab(
        `/document/${selectedState}/ddt_startup_complex_type_doc`,
      ),
    [openTabOrCreateNewTab, selectedState],
  )

  return (
    <Tips text="Перейти в документ">
      <ShowDocumentButton className="ml-1" onClick={handleClick}>
        <Icon icon={DocumentShowIcon} />
      </ShowDocumentButton>
    </Tips>
  )
}

ShowDocumentComponent.propTypes = {
  selectedState: PropTypes.string.isRequired,
}

export default ShowDocumentComponent
