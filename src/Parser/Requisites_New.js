import { useCallback, useContext, useMemo } from 'react'
import { ApiContext, TASK_ITEM_REQUISITES } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import {
  propsTransmission,
  readOnlyRules,
  validationRules,
  visibleRules,
} from '@/Pages/Tasks/item/Pages/Requisites/rules'
import NoFieldType from '@/Components/NoFieldType'
import ScrollBar from '@Components/Components/ScrollBar'
import { CustomValuesContext } from '@/Pages/Tasks/item/Pages/Requisites/constants'
import { RequisitesForm } from '@/Pages/Tasks/item/Pages/Requisites/styles'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { useParams } from 'react-router-dom'
import { DocumentTypeContext } from '@/Pages/Tasks/item/constants'

export const Requisites = ({ type: documentType, documentState }) => {
  const api = useContext(ApiContext)

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

  const parsedDesign = useMemo(
    () =>
      (data || []).reduce(
        (
          acc,
          {
            type,
            col,
            row,
            width,
            height,
            attr,
            attr: {
              dss_attr_label,
              dss_attr_name,
              dss_placeholder,
              dsb_readonly,
              dss_validation_rule,
              dss_visible_rule,
              dss_readonly_rule,
            },
          },
        ) => {
          if (dss_visible_rule) {
            const { args, condition, disabled } = dss_visible_rule
              .match(/[^&|]+|(&|\||.)\b/gm)
              .reduce(
                (acc, condition, i) => {
                  if (i % 2 === 1) {
                    acc.condition = `${acc.condition} ${condition}${condition}`
                  } else {
                    const [rule, id, ...values] =
                      condition.match(/[^:,[\]\s$]+/gm)
                    const { condition: ruleCondition, disabled } = visibleRules[
                      rule
                    ](id, values)

                    acc.condition = `${acc.condition} ${ruleCondition}`
                    if (disabled) {
                      acc.disabled.push(disabled)
                    }
                    acc.args.add(id)
                  }
                  return acc
                },
                { condition: '', disabled: [], args: new Set() },
              )
            // eslint-disable-next-line no-new-func
            acc.visibility.set(
              dss_attr_name,
              new Function(
                `{${[...args].join(',')}} = {}`,
                `return ${condition}`,
              ),
            )
            if (disabled.length > 0) {
              disabled.forEach((d) => acc.disabled.set(...d))
            }
          }

          if (dss_readonly_rule) {
            const [rule, id, values] = dss_readonly_rule.match(/[^:,]+/gm)
            // eslint-disable-next-line no-new-func
            if (!acc.disabled.has(dss_attr_name)) {
              acc.disabled.set(
                dss_attr_name,
                new Function(
                  'obj = {}',
                  `return ${readOnlyRules[rule](id, values)}`,
                ),
              )
            }
          }
          if (dss_validation_rule) {
            acc.rules[dss_attr_name] = dss_validation_rule
              .split('|')
              .map((rule) => {
                const [ruleName, ...args] = rule.startsWith('regex')
                  ? rule.split(':')
                  : rule.startsWith('{')
                  ? rule.split()
                  : rule.split(/([,:])/gm)

                const {
                  [ruleName]: validationRule = validationRules.defaultForJson,
                } = validationRules
                return validationRule(...args, ruleName)
              })
          }

          const { [type]: transmission = () => ({ component: NoFieldType }) } =
            propsTransmission

          acc.fields.set(dss_attr_name, {
            // components: ()=>
            id: dss_attr_name,
            label: dss_attr_label,
            placeholder: dss_placeholder,
            disabled: dsb_readonly,
            ...transmission({
              api,
              backConfig: attr,
              nextProps: {},
              type,
              documentType,
              interceptors: acc.interceptors,
            }),
            style: {
              gridColumn: `${col + 1}/${col + width + 1}`,
              gridRow: `${row + 1}/${row + height + 1}`,
              height: height > 1 ? '100%' : undefined,
            },
          })

          return acc
        },
        {
          fields: new Map(),
          rules: new Map(),
          visibility: new Map(),
          disabled: new Map(),
          interceptors: new Map(),
        },
      ),
    [api, data, documentType],
  )


  const { fields, rules, interceptors } = useMemo(() => {
    const { fields, visibility, disabled, rules, interceptors } = parsedDesign
    const interceptorsFunctions = new Map()
    const fieldsCopy = new Map(fields)
    disabled.forEach((condition, key) => {
      fieldsCopy.set(key, {
        ...fieldsCopy.get(key),
        disabled: condition(values),
      })
    })
    visibility.forEach((condition, key) => {
      if (!condition(values)) {
        fieldsCopy.delete(key)
      }
    })
    interceptors.forEach((deps, key) => {
      interceptorsFunctions.set(key, ({ handleInput }) =>
        deps.forEach((key) => handleInput(undefined, key)),
      )
    })

    return {
      fields: Array.from(fieldsCopy.values()),
      rules,
      interceptors: interceptorsFunctions,
    }
  }, [values, parsedDesign])

  console.log(fields, 'fields')


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
          fields={fields}
          rules={rules}
          interceptors={interceptors}
        />
        {/* </CacheContext.Provider>*/}
      </CustomValuesContext.Provider>
    </ScrollBar>
  )
}

Requisites.defaultProps = {}
Requisites.propTypes = {}

const Requisites_New = () => {
  const { type } = useParams()
  const documentType = useContext(DocumentTypeContext)

  const documentState = useTabItem({
    stateId: documentType,
  })

  return <Requisites type={type} documentState={documentState} />
}

Requisites_New.defaultProps = {}
Requisites_New.propTypes = {}

export default Requisites_New
