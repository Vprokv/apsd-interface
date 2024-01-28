import { useCallback, useState } from 'react'
import Button from '@/Components/Button'
import { useParams } from 'react-router-dom'
import OrgStructureComponentWithTemplateWindowWrapper from '@/Components/Inputs/OrgStructure/OrgstructureComponentWithTemplate'

const OrgStructure = (props) => {
  const { id } = useParams()
  const { sendValue } = props
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
      <OrgStructureComponentWithTemplateWindowWrapper
        {...props}
        multiple={true}
        valueKey={'emplId'}
        // WindowComponent={OrgStructureComponentWithTemplateWindowWrapper}
        open={addEmployeeWindow}
        onClose={closeEmployeeWindow}
        docId={id}
        onInput={sendValue}
        returnObjects={true}
      />
    </>
  )
}

export default OrgStructure
