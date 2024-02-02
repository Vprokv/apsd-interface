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
import useReadDataState from '@Components/Logic/Tab/useReadDataState'

export const Requisites = ({ permits }) => {
  const api = useContext(ApiContext)
  const { type: documentType } = useParams()
  const docContextType = useContext(DocumentTypeContext)

  const [documentState, setDocumentState] = useTabItem({
    stateId: docContextType,
  })

  const {
    touched,
    changed,
    submitFailed,
    formHasSubmitted,
    validationErrors,
    backendValidationErrors,
  } = documentState

  const [
    { data: documentData, data: { values, valuesCustom } = {} },
    setDocumentData,
  ] = useReadDataState(documentState, setDocumentState)

  const [tabItemState, setTabItemState] = useTabItem({
    stateId: TASK_ITEM_REQUISITES,
  })

  const onFormInput = useCallback(
    (formData) =>
      setDocumentData({
        ...documentData,
        values: formData,
      }),
    [documentData, setDocumentData],
  )

  const [{ data: fieldsDesign }] = useAutoReload(
    useCallback(async () => {
      const {
        data: { children },
      } = await api.post(`/sedo/type/config/${documentType}/design`)
      return children
    }, [api, documentType]),
    tabItemState,
    setTabItemState,
  )
  const { fields, ...formProps } = useRequisitesParser({
    value: values,
    fieldsDesign,
    allowedSaveByPermits: permits.some((p) => p === PERMITS_SAVE),
  })

  // TODO APSD-1928 обсудить с бэками и вырезать этот функционал
  const [customFieldsState, setCustomFieldsState] = useState({})
  useEffect(() => {
    if (
      documentType === 'ddt_startup_complex_type_doc' &&
      values.dss_status === 'unsaved'
    ) {
      if (values.dsid_title) {
        ;(async () => {
          const { data: fieldValues } = await api.post(
            URL_PRE_SET_FIELD_VALUES,
            {
              objectId: values.dsid_title,
            },
          )
          setCustomFieldsState(
            Object.entries(fieldValues).reduce((acc, [key, value]) => {
              const field =
                fieldsDesign.find(
                  ({ attr: { dss_attr_name } }) => dss_attr_name === key,
                ) || {}
              if ('Combobox' === field.type) {
                acc[key] = {
                  options: [
                    {
                      [field.attr.dss_reference_attr || 'r_object_id']:
                        value.value,
                      [field.attr.dss_reference_attr_label || 'dss_name']:
                        value.caption,
                    },
                  ],
                }
              } else if ('Orgstructure' === field.type) {
                acc[key] = {
                  options: Array.isArray(value?.value)
                    ? [
                        {
                          emplId: value.value[0],
                          fullDescription: value.caption,
                        },
                      ]
                    : [
                        {
                          emplId: value.value,
                          fullDescription: value.caption,
                        },
                      ],
                }
              }
              return acc
            }, {}),
          )
          setDocumentData((data) => {
            return {
              ...data,
              values: {
                ...data.values,
                ...Object.entries(fieldValues).reduce(
                  (acc, [key, { value }]) => {
                    if (value !== '') {
                      acc[key] = value
                    }
                    return acc
                  },
                  {},
                ),
              },
            }
          })
        })()
      } else {
        setCustomFieldsState({})
        setDocumentData((data) => {
          return {
            ...data,
            values: {
              ...data.values,
              dsid_title_type: undefined,
              dss_description: undefined,
              dsd_ipr_cost: undefined,
              dsdt_end: undefined,
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
