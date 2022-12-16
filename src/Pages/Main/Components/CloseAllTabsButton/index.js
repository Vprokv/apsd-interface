import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Container } from '@/Pages/Main/Components/Tab/styles'
import { TabStateManipulation } from '@Components/Logic/Tab'

const CloseAllTabButton = () => {
  const { onCloseAllTab } = useContext(TabStateManipulation)

  return (
    <Container
      active={true}
      className="rounded-md flex items-center py-1 px-1.5 font-size-12 justify-center mr-1 whitespace-nowrap"
      title={'Закрыть все окна'}
      onClick={onCloseAllTab}
    >
      <span className="truncate">{'Закрыть все окна'}</span>
    </Container>
  )
}

CloseAllTabButton.propTypes = {}

export default CloseAllTabButton
