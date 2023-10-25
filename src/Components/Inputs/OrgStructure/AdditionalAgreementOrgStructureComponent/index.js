import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { LoadableAlwaysRenderValuesSelect } from '@/Components/Inputs/Select'
import { SearchButton } from '@/Components/Inputs/UserSelect'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import AddEmployee from '@/Components/Inputs/OrgStructure/UserSearchWindow'
import UserAggrementSearchWindowWrapper from '@/Components/Inputs/OrgStructure/AdditionalAgreementOrgStructureComponent/Components/UserAggrementSearchWindowWrapper'

const AdditionalAgreementOrgStructureComponent = (props) => {
  const [addEmployeeWindow, setAddEmployeeWindowState] = useState(false)
  const openEmployeeWindow = useCallback(
    () => setAddEmployeeWindowState(true),
    [],
  )
  const closeEmployeeWindow = useCallback(
    () => setAddEmployeeWindowState(false),
    [],
  )

  return (
    <div className="flex items-center w-full">
      <LoadableAlwaysRenderValuesSelect
        {...props}
        loadFunction={loadRefSelectFunc}
        className="mr-0"
      />
      <>
        <SearchButton className="ml-1" onClick={openEmployeeWindow}>
          <Icon icon={searchIcon} />
        </SearchButton>
        <UserAggrementSearchWindowWrapper
          {...props}
          open={addEmployeeWindow}
          onClose={closeEmployeeWindow}
        />
      </>
    </div>
  )
}

AdditionalAgreementOrgStructureComponent.propTypes = {}

export default AdditionalAgreementOrgStructureComponent
