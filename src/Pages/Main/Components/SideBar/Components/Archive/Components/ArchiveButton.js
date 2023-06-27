import PropTypes from 'prop-types'
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import Tips from '@/Components/Tips'
import { ContextArchiveContainerWidth } from '../constants'

const ArchiveButton = ({ name, onClick }) => {
  const RefFullWidthContainer = useRef()
  const RefVisibleTextContainerRef = useRef()
  const containerWidth = useContext(ContextArchiveContainerWidth)
  const [renderTips, setRenderTips] = useState(false)

  useLayoutEffect(() => {
    setRenderTips(
      RefFullWidthContainer.current.clientWidth >
        RefVisibleTextContainerRef.current.clientWidth,
    )
  }, [containerWidth])

  const Container = renderTips ? Tips : React.Fragment
  return (
    <Container text={name} className="max-w-lg text-center">
      <button
        type="button"
        className="flex text-left overflow-hidden"
        onClick={onClick}
      >
        <span
          ref={RefFullWidthContainer}
          style={{ left: 10000 }}
          className="absolute whitespace-nowrap"
        >
          {name}
        </span>
        <span className="mr-auto truncate" ref={RefVisibleTextContainerRef}>
          {name}
        </span>
      </button>
    </Container>
  )
}

ArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export const FirstLevelArchiveButton = ({ name, toggleChildrenRender }) => (
  <ArchiveButton name={name} onClick={toggleChildrenRender} />
)

FirstLevelArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  toggleChildrenRender: PropTypes.func.isRequired,
}

export const SecondArchiveButton = ({
  name,
  onOpenNewTab,
  parentName,
  sectionId,
}) => {
  const handleClick = useCallback(() => {
    onOpenNewTab(
      `/task/list/${parentName.replaceAll('/', '%2f')}/${name.replaceAll(
        '/',
        '%2f',
      )}/${sectionId}`,
    )
  }, [onOpenNewTab, parentName, name, sectionId])
  return <ArchiveButton name={name} onClick={handleClick} />
}

SecondArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  parentName: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  onOpenNewTab: PropTypes.func.isRequired,
}

export const OthersLevelsArchiveButton = ({
  name,
  onOpenNewTab,
  parentName,
  id,
  sectionId,
}) => {
  const handleClick = useCallback(() => {
    onOpenNewTab(
      `/task/list/${parentName.replaceAll('/', '%2f')}/${name.replaceAll(
        '/',
        '%2f',
      )}/${id}${sectionId ? `/${sectionId}` : ''}`,
    )
  }, [onOpenNewTab, parentName, name, id, sectionId])
  return <ArchiveButton name={name} onClick={handleClick} />
}

OthersLevelsArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  parentName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  onOpenNewTab: PropTypes.func.isRequired,
}

export default ArchiveButton
