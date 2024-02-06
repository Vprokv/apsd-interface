import PropTypes from 'prop-types'
import { SidebarEntity } from '@/Pages/Tasks/item/styles'

const ProjectCalcTypeComponent = ({
  dsid_startup_complex,
  dss_description,
  dss_reg_number,
}) => {
  const { values: { dss_description: titleDescription = '' } = {} } =
    dsid_startup_complex || {}

  return (
    <SidebarEntity className="flex flex-col m-4 break-words font-size-12">
      <div className="mb-2">
        <span className="font-medium">Том: </span>
        <span>{dss_description}</span>
      </div>
      <div className="mb-2">
        <span className="font-medium">Шифр: </span>
        <span>{dss_reg_number}</span>
      </div>
      <div className="mb-2">
        <span className="font-medium">Титул: </span>
        <span>{titleDescription}</span>
      </div>
    </SidebarEntity>
  )
}

ProjectCalcTypeComponent.propTypes = {
  dsid_startup_complex: PropTypes.object,
  dss_description: PropTypes.string,
  dss_reg_number: PropTypes.string,
}

export default ProjectCalcTypeComponent
