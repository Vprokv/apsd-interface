import React, { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import DocumentShowIcon from '@/Icons/DocumentShowIcon'
import styled from 'styled-components'
import { TabStateManipulation } from '@Components/Logic/Tab'
import OverlayButton from '@/Components/OverlayMenu/OverlayButton'

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
const OverlayIconButton = OverlayButton(ShowDocumentButton)

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
    <OverlayIconButton
      className="ml-1"
      text="Перейти в документ"
      onClick={handleClick}
      icon={DocumentShowIcon}
    />
  )
}

ShowDocumentComponent.propTypes = {
  selectedState: PropTypes.string.isRequired,
}

export default ShowDocumentComponent
