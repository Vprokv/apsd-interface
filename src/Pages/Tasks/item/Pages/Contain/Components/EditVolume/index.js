import {ButtonForIcon} from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import editIcon from '@/Icons/editIcon'
import {useCallback, useContext} from 'react'
import {TabStateManipulation} from '@Components/Logic/Tab'
import {useNavigate} from 'react-router-dom'

const EditVolume = ({selected: {id, tomId, type}}) => {
  const {openNewTab} = useContext(TabStateManipulation)
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    if (!tomId || !type) {
      return
    }

    return openNewTab(navigate(`/task/${id}/${type}`))
  }, [id, tomId, type])

  return (
    <ButtonForIcon className="mr-2" onClick={handleClick}>
      <Icon icon={editIcon} />
    </ButtonForIcon>
  )
}

EditVolume.defaultProps = {
};

export default EditVolume
