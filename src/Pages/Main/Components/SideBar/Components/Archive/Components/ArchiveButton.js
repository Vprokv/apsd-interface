import PropTypes from 'prop-types'
import { useCallback, useMemo, useRef } from 'react'
import Tips from '@/Components/Tips'

const ArchiveButton = ({ name, onClick, width, level }) => {
  const ref = useRef()
  const widthForText = useMemo(
    () => width - (level + 1) * 14 - 30,
    [level, width],
  )

  const withTips = useMemo(
    () => name?.split('').length * 12 * 0.2645833333333 > widthForText,
    [name, widthForText],
  )

  console.log(ref, 'ref.current?.clientWidth')
  console.log(ref.current?.clientWidth, 'ref.current?.clientWidth')

  return (
    <>
      <span ref={ref} style={{ left: 1000 }} className="absolute">
        {name}
      </span>
      {withTips ? (
        <Tips text={name}>
          <button type="button" className="flex text-left " onClick={onClick}>
            <span style={{ width: widthForText }} className="mr-auto truncate">
              {name}
            </span>
          </button>
        </Tips>
      ) : (
        <button type="button" className="flex text-left " onClick={onClick}>
          <span style={{ width: widthForText }} className="mr-auto truncate">
            {name}
          </span>
        </button>
      )}
    </>
  )
}

ArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export const FirstLevelArchiveButton = ({
  name,
  toggleChildrenRender,
  width,
  level,
}) => (
  <ArchiveButton
    name={name}
    onClick={toggleChildrenRender}
    width={width}
    level={level}
  />
)

FirstLevelArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  toggleChildrenRender: PropTypes.func.isRequired,
}

export const SecondArchiveButton = ({
  name,
  width,
  onOpenNewTab,
  parentName,
  sectionId,
  level,
}) => {
  const handleClick = useCallback(() => {
    onOpenNewTab(
      `/task/list/${parentName.replaceAll('/', '%2f')}/${name.replaceAll(
        '/',
        '%2f',
      )}/${sectionId}`,
    )
  }, [onOpenNewTab, parentName, name, sectionId])
  return (
    <ArchiveButton
      name={name}
      onClick={handleClick}
      width={width}
      level={level}
    />
  )
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
  width,
  level,
}) => {
  const handleClick = useCallback(() => {
    onOpenNewTab(
      `/task/list/${parentName.replaceAll('/', '%2f')}/${name.replaceAll(
        '/',
        '%2f',
      )}/${id}${sectionId ? `/${sectionId}` : ''}`,
    )
  }, [onOpenNewTab, parentName, name, id, sectionId])
  return (
    <ArchiveButton
      name={name}
      onClick={handleClick}
      width={width}
      level={level}
    />
  )
}

OthersLevelsArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  parentName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  onOpenNewTab: PropTypes.func.isRequired,
}

export default ArchiveButton
