import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { LoadableAlwaysRenderValuesSelect } from '@/Components/Inputs/Select'
import {
  AddUserOptionsFullName,
  SearchButton,
} from '@/Components/Inputs/UserSelect'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import UserAggrementSearchWindowWrapper from '@/Components/Inputs/OrgStructure/AdditionalAgreementOrgStructureComponent/Components/UserAggrementSearchWindowWrapper'
import { ApiContext } from '@/contants'
import useDefaultFilter from '@/Components/Inputs/OrgStructure/useDefaultFilter'
import { URL_ADDITIONAL_AGREEMENT_USER_LIST } from '@/ApiList'

const baseLoadFunction = async ({ api, filter, query }) => {
  const { data } = await api.post(URL_ADDITIONAL_AGREEMENT_USER_LIST, {
    filter: { ...filter, ...query },
  })
  return data
}

const AdditionalAgreementOrgStructureComponent = (props) => {
  const { loadFunction, filter: baseFilter } = props
  const api = useContext(ApiContext)
  const defaultFilter = useDefaultFilter({ baseFilter })
  const [addEmployeeWindow, setAddEmployeeWindowState] = useState(false)
  const openEmployeeWindow = useCallback(
    () => setAddEmployeeWindowState(true),
    [],
  )
  const closeEmployeeWindow = useCallback(
    () => setAddEmployeeWindowState(false),
    [],
  )

  const loadRefSelectFunc = useCallback(
    async (query) => {
      const { branchId, ...otherFilterParams } = defaultFilter

      const filter = query.length > 0 ? otherFilterParams : defaultFilter

      const data = await loadFunction(api)(filter)({ query })
      return data.map(AddUserOptionsFullName)
    },
    [api, defaultFilter, loadFunction],
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

AdditionalAgreementOrgStructureComponent.propTypes = {
  loadFunction: PropTypes.func,
  source: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
}
AdditionalAgreementOrgStructureComponent.defaultProps = {
  loadFunction: (api) => (filter) => (query) =>
    baseLoadFunction({ api, filter, query }),
  valueKey: 'emplId',
  labelKey: 'fullDescription',
  options: [],
  disabled: false,
  source: '',
}

export default AdditionalAgreementOrgStructureComponent
