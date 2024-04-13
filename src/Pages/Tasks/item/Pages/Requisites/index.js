import { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import ScrollBar from '@Components/Components/ScrollBar'
import { RequisitesForm } from './styles'
import { DocumentTypeContext } from '../../constants'
import { CustomValuesContext } from './constants'
import useRequisitesInfo from '@/Pages/Tasks/item/Hooks/useRequisitesInfo'
import { TASK_ITEM_REQUISITES } from '@/contants'
import Validator from '@Components/Logic/Validator'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'
import { CurrentTabContext, useTabItem } from '@Components/Logic/Tab'

export const Requisites = ({ permits }) => {
  const docContextType = useContext(DocumentTypeContext)

  const [documentState, setDocumentState] = useTabItem({
    stateId: docContextType,
  })

  const [tabItemState, setTabItemState] = useTabItem({
    stateId: TASK_ITEM_REQUISITES,
  })

  const { currentTabID } = useContext(CurrentTabContext)
  const {
    fieldsWithLoadedProps,
    onFormInput,
    values,
    valuesCustom,
    formProps: { rules, ...formProps },
  } = useRequisitesInfo({
    docContextType,
    permits,
    tabItemState,
    setTabItemState,
    documentState,
    setDocumentState,
  })

  console.log(valuesCustom, 'valuesCustom')
  return (
    <ScrollBar className="w-full">
      <CustomValuesContext.Provider value={valuesCustom}>
        <Validator
          rules={rules}
          value={values}
          validationState={useMemo(() => {
            const { validationState = {}, backendValidationErrors } =
              documentState
            return backendValidationErrors
              ? Object.entries(backendValidationErrors).reduce(
                  (acc, [key, error]) => {
                    acc.errors[key] = [error, ...(acc.errors[key] || [])]
                    return acc
                  },
                  {
                    ...validationState,
                    errors: { ...validationState?.errors },
                  },
                )
              : validationState
          }, [
            documentState?.validationState,
            documentState.backendValidationErrors,
          ])}
          setValidationState={useCallback(
            (validationState) =>
              setDocumentState({
                validationState: {
                  ...documentState?.validationState,
                  ...validationState,
                },
              }),
            [documentState?.validationState, setDocumentState],
          )}
        >
          <RequisitesForm
            inputWrapper={WithValidationStateInputWrapper}
            value={values}
            onInput={onFormInput}
            fields={fieldsWithLoadedProps}
            {...formProps}
          />
        </Validator>
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
