import { useCallback, useState } from 'react'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import AddEmployee from '@/Components/Inputs/OrgStructure/UserSearchWindow'
import { SearchButton } from '@/Components/Inputs/UserSelect'
import LoadableSelect from '@/Components/Inputs/Select'
import { RenderMultipleValueSelectInput } from '@Components/Components/Inputs/Select'

const LinkOrgStructureComponent = (props) => {
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
      <LoadableSelect
        {...props}
        multipleInputComponent={RenderMultipleValueSelectInput}
        className="mr-0"
      />
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

LinkOrgStructureComponent.defaultProps = {
  // loadFunction: (api) => (filter) => async (search) => {
  //   const {
  //     data: { content },
  //   } = await api.post(URL_LINK_USER_LIST, {
  //     filter: { ...filter, query: search },
  //   })
  //   return content.map(AddUserOptionsFullName)
  // },
  // valueKey: 'emplId',
  // labelKey: 'fullDescription',
  // options: [],
  // disabled: false,
  // source: '',
}

LinkOrgStructureComponent.propTypes = {}

export default LinkOrgStructureComponent
