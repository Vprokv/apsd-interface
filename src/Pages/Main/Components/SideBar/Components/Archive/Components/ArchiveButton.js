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

const ArchiveButton = ({ name, onClick, key }) => {
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
    <Container key={key} text={name} className="max-w-lg text-center">
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

export const FirstLevelArchiveButton = ({
  name,
  toggleChildrenRender,
  key,
}) => <ArchiveButton name={name} onClick={toggleChildrenRender} key={key} />

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
  key,
}) => {
  const handleClick = useCallback(() => {
    onOpenNewTab(
      `/task/list/${parentName.replaceAll('/', '%2f')}/${name.replaceAll(
        '/',
        '%2f',
      )}/${sectionId}`,
    )
  }, [onOpenNewTab, parentName, name, sectionId])
  return <ArchiveButton name={name} onClick={handleClick} key={key} />
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
  key,
}) => {
  const handleClick = useCallback(() => {
    onOpenNewTab(
      `/task/list/${parentName.replaceAll('/', '%2f')}/${name.replaceAll(
        '/',
        '%2f',
      )}/${id}${sectionId ? `/${sectionId}` : ''}`,
    )
  }, [onOpenNewTab, parentName, name, id, sectionId])
  return <ArchiveButton name={name} onClick={handleClick} key={key} />
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
  key,
}) => {
  const { loading } = useContext(ContextArchiveLoading)
  const isLoad = useMemo(() => loading === levelId, [levelId, loading])
  return (
    <button
      className="pl-2 mr-2 "
      type="button"
      onClick={toggleDisplayedFlag}
      key={key}
    >
      {isLoad ? (
        <Loading width={'20px'} height={'20px'} />
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
  key: PropTypes.string.isRequired,
  levelId: PropTypes.string.isRequired,
  isDisplayed: PropTypes.bool.isRequired,
  toggleDisplayedFlag: PropTypes.func.isRequired,
}
