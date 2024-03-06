import { useContext } from 'react'
import PropTypes from 'prop-types'
import ScrollBar from '@Components/Components/ScrollBar'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { RequisitesForm } from './styles'
import { DocumentTypeContext } from '../../constants'
import { CustomValuesContext } from './constants'
import useRequisitesInfo from '@/Pages/Tasks/item/Hooks/useRequisitesInfo'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { TASK_ITEM_REQUISITES } from '@/contants'

export const Requisites = ({ permits }) => {
  const docContextType = useContext(DocumentTypeContext)

  const [documentState, setDocumentState] = useTabItem({
    stateId: docContextType,
  })
  const [tabItemState, setTabItemState] = useTabItem({
    stateId: TASK_ITEM_REQUISITES,
  })

  const {
    fieldsWithLoadedProps,
    onFormInput,
    values,
    valuesCustom,
    formProps,
  } = useRequisitesInfo({
    docContextType,
    permits,
    tabItemState,
    setTabItemState,
    documentState,
    setDocumentState,
  })

  const {
    touched,
    changed,
    submitFailed,
    formHasSubmitted,
    validationErrors,
    backendValidationErrors,
  } = documentState

  return (
    <ScrollBar className="w-full">
      <CustomValuesContext.Provider value={valuesCustom}>
        <RequisitesForm
          touched={touched}
          changed={changed}
          submitFailed={submitFailed}
          formHasSubmitted={formHasSubmitted}
          onUpdateValidateState={setDocumentState}
          validationErrors={validationErrors}
          backendValidationErrors={backendValidationErrors}
          inputWrapper={DefaultWrapper}
          value={values}
          onInput={onFormInput}
          {...formProps}
          fields={fieldsWithLoadedProps}
        />
      </CustomValuesContext.Provider>
    </ScrollBar>
  )
}

Requisites.defaultProps = {
  permits: [],
}
Requisites.propTypes = {
  permits: PropTypes.arrayOf(PropTypes.string),
}

export default Requisites
