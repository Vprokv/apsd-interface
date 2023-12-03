import { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import { Container } from '@/Pages/Main/Components/Tab/styles'
import { TabStateManipulation } from '@Components/Logic/Tab'

const CloseAllTabButton = ({ tabs }) => {
  const { onCloseTab } = useContext(TabStateManipulation)

  const onCloseAllTabs = useCallback(() => {
    for (let i = tabs.length - 1; i > 0; i--) {
      onCloseTab(i)
    }
  }, [onCloseTab, tabs.length])

  return (
    <Container
      active={true}
      className="rounded-md flex items-center py-1 px-1.5 font-size-12 justify-center whitespace-nowrap"
      title="Закрыть все окна"
      onClick={onCloseAllTabs}
    >
      <span className="truncate">Закрыть все окна</span>
    </Container>
  )
}

CloseAllTabButton.propTypes = {
  tabs: PropTypes.array.isRequired,
}

export default CloseAllTabButton
