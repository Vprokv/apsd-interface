import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiContext } from '@/contants'
import { useParams } from 'react-router-dom'
import { URL_PRE_SET_FIELD_VALUES } from '@/ApiList'
import { useAutoReload, useReadDataState } from '@Components/Logic/Tab'
import useRequisitesParser from '@/Pages/Tasks/item/Pages/Requisites/parser'
import { PERMITS_SAVE } from '@/Pages/Tasks/item/Pages/Requisites/constants'

const useRequisitesInfo = ({
  tabItemState,
  setTabItemState,
  documentState,
  setDocumentState,
  permits,
  docContextType,
}) => {
  const api = useContext(ApiContext)
  const { type: documentType } = useParams()
  const [customFieldsState, setCustomFieldsState] = useState({})

  const [
    { data: documentData, data: { values = {}, valuesCustom = {} } = {} },
    setDocumentData,
  ] = useReadDataState(docContextType)

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

  useEffect(() => {
    if (
      documentType === 'ddt_startup_complex_type_doc' &&
      values?.dss_status === 'unsaved'
    ) {
      if (values?.dsid_title) {
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
                    ? value?.value.map(({ value, caption }) => ({
                        emplId: value,
                        fullDescription: caption,
                      }))
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
                      acc[key] = Array.isArray(value)
                        ? value.map(({ value: v }) => v)
                        : value
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
  }, [
    api,
    documentType,
    fieldsDesign,
    setDocumentData,
    values?.dsid_title,
    values?.dss_status,
  ])

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

  return useMemo(
    () => ({
      documentState,
      setDocumentState,
      fieldsWithLoadedProps,
      onFormInput,
      values,
      valuesCustom,
      formProps,
    }),
    [
      documentState,
      fieldsWithLoadedProps,
      formProps,
      onFormInput,
      setDocumentState,
      values,
      valuesCustom,
    ],
  )
}

export default useRequisitesInfo
