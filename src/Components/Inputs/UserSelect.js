import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Select from './Select'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import styled from 'styled-components'
import AddEmployee from './OrgStructure/UserSearchWindow'
import { ApiContext } from '@/contants'
import { URL_EMPLOYEE_LIST } from '@/ApiList'
import useDefaultFilter from './OrgStructure/useDefaultFilter'

export const AddUserOptionsFullName = (v = {}) => ({
  ...v,
  fullName: `${v.lastName} ${v.firstName} ${v.middleName}`,
  fullDescription: v.fullDescription
    ? v.fullDescription
    : `${v.firstName} ${v.middleName} ${v.lastName}, ${v.position}, ${v.department}`,
})

export const baseLoadFunction = async ({ api, filter, search }) => {
  const {
    data: { content },
  } = await api.post(URL_EMPLOYEE_LIST, {
    filter,
  })
  return content
}

export const SearchButton = styled.button.attrs({ type: 'button' })`
  background-color: var(--light-blue);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: var(--form--elements_height);
  width: var(--form--elements_height);
  min-width: var(--form--elements_height);
`

const UserSelect = (props) => {
  const { loadFunction, source, docId } = props
  const api = useContext(ApiContext)
  const defaultFilter = useDefaultFilter({ source, docId })
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
    async (search) => {
      const data = await loadFunction(api)(defaultFilter)(search)
      return data.map(AddUserOptionsFullName)
    },
    [api, defaultFilter, loadFunction],
  )

  return (
    <div className="flex items-center w-full">
      <Select {...props} loadFunction={loadRefSelectFunc} />
      <>
        <SearchButton className="ml-1" onClick={openEmployeeWindow}>
          <Icon icon={searchIcon} />
        </SearchButton>
        <AddEmployee
          {...props}
          open={addEmployeeWindow}
          onClose={closeEmployeeWindow}
        />
      </>
    </div>
  )
}

UserSelect.propTypes = {
  loadFunction: PropTypes.func,
  source: PropTypes.string.isRequired,
  docId: PropTypes.string,
}
UserSelect.defaultProps = {
  loadFunction: (api) => (filter) => (search) =>
    baseLoadFunction({ api, filter, search }),
  valueKey: 'emplId',
  labelKey: 'fullDescription',
  options: [],
  docId: undefined,
}
export default UserSelect
