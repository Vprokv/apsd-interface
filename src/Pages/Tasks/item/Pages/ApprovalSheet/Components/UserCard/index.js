import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { UserCircle } from './styles'
import colorFromString from '@Components/Utils/colorFromString'

const UserCard = ({ fio, position } = {}) => {
  const bg = useMemo(() => {
    return typeof fio === 'string' && colorFromString(fio, 30, 80)
  }, [fio])

  return (
    <div className="flex items-center justify-center">
      <UserCircle bg={bg} className="mr-2">
        {`${fio?.length && fio[0]}`}
      </UserCircle>
      <div>
        <div className="font-size-14">{fio}</div>
        <div className="font-size-12 color-text-secondary">{position}</div>
      </div>
    </div>
  )
}

UserCard.propTypes = {
  fio: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
}

UserCard.defaultProps = {}

export default UserCard

// Компонент сдизайнен для компонента ListTable и это его пропорции
export const sizes = 180
