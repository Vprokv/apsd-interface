import React, { useCallback, useState } from 'react'
import Button from '../../../../../../../../../Components/Button'
import AddEmployee from '../../../../../../../../../Components/Inputs/OrgStructure/UserSearchWindow'

const OrgStructure = (props) => {
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
    <>
      <Button
        className="bg-blue-5 color-blue-1 flex items-center justify-center text-sm font-weight-normal height-small leading-4 padding-medium"
        onClick={openEmployeeWindow}
      >
        Добавить пользователей
      </Button>
      <AddEmployee
        {...props}
        multiple={true}
        valueKey={'emplId'}
        open={addEmployeeWindow}
        onClose={closeEmployeeWindow}
      />
    </>
  )
}

export default OrgStructure
