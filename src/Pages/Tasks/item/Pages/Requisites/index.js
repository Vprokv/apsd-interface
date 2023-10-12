import { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import ScrollBar from '@Components/Components/ScrollBar'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { RequisitesForm } from './styles'
import useTabItem from '@/components_ocean/Logic/Tab/TabItem'
import { ApiContext, TASK_ITEM_REQUISITES } from '@/contants'
import { DocumentTypeContext } from '../../constants'
import { useParams } from 'react-router-dom'
import { CustomValuesContext, PERMITS_SAVE } from './constants'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useRequisitesParser from '@/Pages/Tasks/item/Pages/Requisites/parser'

export const Requisites = ({ permits }) => {
  const api = useContext(ApiContext)
  const { type: documentType } = useParams()
  const docContextType = useContext(DocumentTypeContext)

  const documentState = useTabItem({
    stateId: docContextType,
  })

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_REQUISITES,
  })
  const {
    tabState: { data, cache },
  } = tabItemState
  const {
    tabState: {
      data: documentData,
      data: { values, valuesCustom } = {},
      touched,
      changed,
      submitFailed,
      formHasSubmitted,
      validationErrors,
      backendValidationErrors,
    },
    setTabState: setDocumentState,
  } = documentState

  // useEffect(() => {
  //   if (!cache) {
  //     setDocumentState({ cache: new Map() })
  //   }
  // }, [cache, setDocumentState])

  const onFormInput = useCallback(
    (formData) =>
      setDocumentState({
        data: {
          ...documentData,
          values: formData,
        },
      }),
    [documentData, setDocumentState],
  )

  const loadData = useCallback(async () => {
    const {
      data: { children },
    } = await api.post(`/sedo/type/config/${documentType}/design`)
    return children
  }, [api, documentType])

  useAutoReload(loadData, tabItemState)
  return (
    <ScrollBar className="w-full">
      <CustomValuesContext.Provider value={valuesCustom}>
        {/* <CacheContext.Provider value={cache}>*/}
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
          {...useRequisitesParser({
            value: values,
            fieldsDesign: data,
            allowedSaveByPermits: permits.some((p) => p === PERMITS_SAVE),
          })}
        />
        {/* </CacheContext.Provider>*/}
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
