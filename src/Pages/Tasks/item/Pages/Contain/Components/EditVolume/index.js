import { ButtonForIcon } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import editIcon from '@/Icons/editIcon'
import { useCallback, useContext } from 'react'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const EditVolume = ({ selected: { tomId, type } }) => {
  const { openNewTab } = useContext(TabStateManipulation)
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    if (!tomId || !type) {
      return
    }

    return openNewTab(navigate(`/task/${tomId}/${type}`))
  }, [tomId, type, openNewTab, navigate])

  return (
    <ButtonForIcon className="mr-2" onClick={handleClick}>
      <Icon icon={editIcon} />
    </ButtonForIcon>
  )
}

EditVolume.propTypes = {
  selected: PropTypes.shape({
    tomId: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
}
EditVolume.defaultProps = {
  selected: {},
}

export default EditVolume
