import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
import { URL_PRE_SET_FIELD_VALUES } from '@/ApiList'

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

  const [customFieldsState, setCustomFieldsState] = useState({})
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
  const { fields, ...formProps } = useRequisitesParser({
    value: values,
    fieldsDesign: data,
    allowedSaveByPermits: permits.some((p) => p === PERMITS_SAVE),
  })

  // TODO APSD-1928 обсудить с бэками и вырезать этот функционал
  useEffect(() => {
    if (
      documentType === 'ddt_startup_complex_type_doc' &&
      values.dss_status === 'unsaved'
    ) {
      if (values.dsid_title) {
        ;(async () => {
          const {
            data: { dsid_title_type, dss_description, dsd_ipr_cost, dsdt_end },
          } = await api.post(URL_PRE_SET_FIELD_VALUES, {
            objectId: values.dsid_title,
          })
          setCustomFieldsState({
            dsid_title_type: {
              options: [
                {
                  r_object_id: dsid_title_type.value,
                  dss_name: dsid_title_type.caption,
                },
              ],
            },
          })
          setDocumentState(({ data }) => {
            return {
              data: {
                ...data,
                values: {
                  ...data.values,
                  dsid_title_type: dsid_title_type.value,
                  dss_description: dss_description.value,
                  dsd_ipr_cost: dsd_ipr_cost.value,
                  dsdt_end: dsdt_end.value,
                },
              },
            }
          })
        })()
      } else {
        setCustomFieldsState({})
        setDocumentState(({ data }) => {
          return {
            data: {
              ...data,
              values: {
                ...data.values,
                dsid_title_type: undefined,
                dss_description: undefined,
                dsd_ipr_cost: undefined,
                dsdt_end: undefined,
              },
            },
          }
        })
      }
    }
  }, [values.dsid_title])
  const fieldsWithLoadedProps = useMemo(
    () =>
      Object.entries(customFieldsState).reduce(
        (acc, [key, value]) => {
          const index = acc.findIndex(({ id }) => id === key)
          acc[index] = { ...acc[index], ...value }
          return acc
        },
        [...fields],
      ),
    [customFieldsState, fields],
  )

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
          {...formProps}
          fields={fieldsWithLoadedProps}
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
