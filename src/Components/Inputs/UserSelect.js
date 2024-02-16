import { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import LoadableSelect from './Select'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import styled from 'styled-components'
import AddEmployee from './OrgStructure/UserSearchWindow'
import { ApiContext } from '@/contants'
import { URL_EMPLOYEE_LIST } from '@/ApiList'
import useDefaultFilter from './OrgStructure/useDefaultFilter'
import { RenderMultipleValueSelectInput } from '@Components/Components/Inputs/Select'

export const AddUserOptionsFullName = (v = {}) => ({
  ...v,
  fullName: `${v.lastName} ${v.firstName} ${v.middleName}`,
  fullDescription: v.fullDescription
    ? v.fullDescription
    : `${v.lastName} ${v.firstName} ${v.middleName} , ${v.position}, ${v.department}`,
})

export const baseLoadFunction = async ({ api, filter, search }) => {
  const {
    data: { content },
  } = await api.post(URL_EMPLOYEE_LIST, {
    filter: { ...filter, query: search },
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

  &:disabled {
    background: var(--separator);
  }
`

const UserSelect = (props) => {
  const {
    loadFunction,
    filter: baseFilter,
    disabled,
    SelectComponent,
    WindowComponent,
  } = props
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
    async (search) => {
      // eslint-disable-next-line no-unused-vars
      const { branchId, ...otherFilterParams } = defaultFilter
      const filter = baseFilter?.branchId // В для поиска в селекте по всем филиалам через query
        ? defaultFilter
        : search?.length > 0
        ? otherFilterParams
        : defaultFilter

      const data = await loadFunction(api)(filter)(search)
      return data.map(AddUserOptionsFullName)
    },
    [api, baseFilter, defaultFilter, loadFunction],
  )

  return (
    <div className="flex w-full">
      <SelectComponent
        {...props}
        loadFunction={loadRefSelectFunc}
        closeOnSelect={true}
        className="mr-0"
      />
      <>
        <SearchButton
          disabled={disabled}
          className="ml-1"
          onClick={openEmployeeWindow}
        >
          <Icon icon={searchIcon} />
        </SearchButton>
        <WindowComponent
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
  SelectComponent: PropTypes.node,
  WindowComponent: PropTypes.node,
  source: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
}
UserSelect.defaultProps = {
  loadFunction: (api) => (filter) => (search) =>
    baseLoadFunction({ api, filter, search }),
  valueKey: 'emplId',
  labelKey: 'fullDescription',
  options: [],
  disabled: false,
  source: '',
  SelectComponent: (props) => (
    <LoadableSelect
      multipleInputComponent={RenderMultipleValueSelectInput}
      {...props}
    />
  ),
  WindowComponent: AddEmployee,
}
export default UserSelect
