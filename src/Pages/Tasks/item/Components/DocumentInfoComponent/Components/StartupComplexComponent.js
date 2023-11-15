import PropTypes from 'prop-types'
import { SidebarEntity } from '@/Pages/Tasks/item/styles'

const StartupComplexComponent = ({ dss_description }) => {
  return (
    <SidebarEntity className="flex flex-col m-4 break-words font-size-12">
      <div className="mb-2">
        <span className="font-medium">Титул: </span>
        <span>{dss_description}</span>
      </div>
    </SidebarEntity>
  )
}

StartupComplexComponent.propTypes = {
  dss_description: PropTypes.string,
}

export default StartupComplexComponent
