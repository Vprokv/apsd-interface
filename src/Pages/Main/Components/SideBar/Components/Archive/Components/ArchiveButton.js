import PropTypes from 'prop-types'
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Tips from '@/Components/Tips'
import {
  ContextArchiveContainerWidth,
  ContextArchiveLoading,
} from '../constants'
import Loading from '@/Components/Loading'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'

const ArchiveButton = ({ name, onClick, id }) => {
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
    <Container key={id} text={name} className="max-w-lg text-center">
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
  key: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export const FirstLevelArchiveButton = ({ name, id }) => (
  <ArchiveButton name={name} onClick={() => null} id={id} />
)

FirstLevelArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  toggleChildrenRender: PropTypes.func.isRequired,
}

export const SecondArchiveButton = ({
  name,
  onOpenNewTab,
  parentName,
  sectionId,
  id,
}) => {
  const handleClick = useCallback(() => {
    const encodeParentName = encodeURIComponent(parentName)
    const encodeName = encodeURIComponent(name)
    onOpenNewTab(`/task/list/${encodeParentName}/${encodeName}/${sectionId}`)
  }, [onOpenNewTab, parentName, name, sectionId])
  return <ArchiveButton name={name} onClick={handleClick} id={id} />
}

SecondArchiveButton.propTypes = {
  key: PropTypes.string.isRequired,
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
    const encodeParentName = encodeURIComponent(parentName)
    const encodeName = encodeURIComponent(name)
    onOpenNewTab(
      `/task/list/${encodeParentName}/${encodeName}/${id}${
        sectionId ? `/${sectionId}` : ''
      }`,
    )
  }, [onOpenNewTab, parentName, name, id, sectionId])
  return <ArchiveButton name={name} onClick={handleClick} id={id} />
}

OthersLevelsArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  parentName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  onOpenNewTab: PropTypes.func.isRequired,
  key: PropTypes.string.isRequired,
}

export default ArchiveButton

export const LevelToggleIcon = ({
  toggleDisplayedFlag,
  isDisplayed,
  levelId,
}) => {
  const { loading } = useContext(ContextArchiveLoading)
  return (
    <button className="pl-2 mr-1 " type="button" onClick={toggleDisplayedFlag}>
      {loading.has(levelId) ? (
        <Loading width={'16px'} height={'16px'} />
      ) : (
        <Icon
          icon={angleIcon}
          size={10}
          className={`color-text-secondary ${isDisplayed ? '' : 'rotate-180'}`}
        />
      )}
    </button>
  )
}

LevelToggleIcon.propTypes = {
  levelId: PropTypes.string.isRequired,
  isDisplayed: PropTypes.bool.isRequired,
  toggleDisplayedFlag: PropTypes.func.isRequired,
}
