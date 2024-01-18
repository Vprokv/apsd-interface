import PropTypes from 'prop-types'

const LinkedDocumentsCell = ({ value, className, ...props }) => {
  const {
    ParentValue: { externalLink, childType, childId },
  } = props

  value = !externalLink && !childType && !childId ? '' : value

  return (
    <div
      className={`${className} flex items-center word-wrap-anywhere font-size-12`}
    >
      {value}
    </div>
  )
}

LinkedDocumentsCell.propTypes = {
  // todo есть ошибка в консоли что value string
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  props: PropTypes.object,
}

LinkedDocumentsCell.defaultProps = {
  className: 'min-h-10 break-all',
}

export default LinkedDocumentsCell

export const sizes = 150
