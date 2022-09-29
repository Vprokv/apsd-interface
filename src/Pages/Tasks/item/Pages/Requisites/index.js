import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import ScrollBar from '@Components/Components/ScrollBar'
import DefaultWrapper from "@/Components/Fields/DefaultWrapper"
import {RequisitesForm} from "./styles"
import useTabItem from "../../../../../components_ocean/Logic/Tab/TabItem"
import {ApiContext, DocumentTypeContext, TASK_ITEM_DOCUMENT, TASK_ITEM_REQUISITES} from "../../../../../contants"
import {useParams} from "react-router-dom"
import {readOnlyRules, validationRules, visibleRules, fieldsDictionary, NoFieldType, propsTransmission} from './rules'
import {CustomValuesContext} from "./constants"


const Requisites = props => {
  const {type} = useParams()
  const documentType = useContext(DocumentTypeContext)
  const api = useContext(ApiContext)
  const {tabState: {data}, setTabState} = useTabItem({
    stateId: TASK_ITEM_REQUISITES
  })
  const {
    tabState: {data: documentData, data: {values, valuesCustom} = {}}, setTabState: setDocumentState
  } = useTabItem({
    stateId: documentType
  })

  const onFormInput = useCallback((formData) => setDocumentState({
    data: {
      ...documentData,
      values: formData
    }
  }), [documentData, setDocumentState])

  useEffect(async () => {
    const {data: {children}} = await api.post(`/sedo/type/config/${documentData.type}/design`)
    setTabState({data: children})
  }, [api, setTabState, documentData])

  const parsedDesign = useMemo(() => (data || []).reduce((acc, {
    type,
    col,
    row,
    width,
    height,
    attr,
    attr: {
      dss_attr_label, dss_attr_name, dss_placeholder, dsb_readonly, dsb_multiply, dss_validation_rule,
      dss_visible_rule, dss_readonly_rule
    }
  }) => {
    if (dss_visible_rule) {
      const {args, condition, disabled} = dss_visible_rule.match(/[^&|]+|(&|\||.)\b/gm).reduce((acc, condition, i) => {
        if (i % 2 === 1) {
          acc.condition = `${acc.condition} ${condition}${condition}`
        } else {
          const [rule, id, ...values] = condition.match(/[^:,[\]\s$]+/gm)
          const {condition: ruleCondition, disabled} = visibleRules[rule](id, values)

          acc.condition = `${acc.condition} ${ruleCondition}`
          if (disabled) {
            acc.disabled.push(disabled)
          }
          acc.args.add(id)
        }
        return acc
      }, {condition: "", disabled: [], args: new Set()})
      // eslint-disable-next-line no-new-func
      acc.visibility.set(dss_attr_name, new Function(`{${[...args].join(",")}} = {}`, `return ${condition}`))
      if (disabled.length > 0) {
        disabled.forEach(d => acc.disabled.set(...d))
      }
    }

    if (dss_readonly_rule) {
      const [rule, id, values] = dss_readonly_rule.match(/[^:,]+/gm)
      // eslint-disable-next-line no-new-func
      if (!acc.disabled.has(dss_attr_name)) {
        acc.disabled.set(dss_attr_name, new Function(`obj = {}`, `return ${readOnlyRules[rule](id, values)}`))
      }
    }
    if (dss_validation_rule) {
      acc.rules[dss_attr_name] = dss_validation_rule.split("|").map((rule) => {
        const [ruleName, ...args] = rule.startsWith("regex") ? rule.split(":") : rule.split(/([,:])/gm)
        console.log(dss_validation_rule, ruleName, args)
        return validationRules[ruleName](...args)
      })
    }

    const {[type]: transmission = () => ({})} = propsTransmission

    acc.fields.set(dss_attr_name, {
      id: dss_attr_name,
      component: fieldsDictionary[type] || NoFieldType,
      label: dss_attr_label,
      placeholder: dss_placeholder,
      disabled: dsb_readonly,
      ...transmission({api, backConfig: attr, nextProps: {}}),
      style: {
        gridColumn: `${col + 1}/${col + width + 1}`,
        gridRow: `grid-row: ${row + 1}/${row + height + 1}`
      }
    })

    return acc
  }, {fields: new Map(), rules: {}, visibility: new Map(), disabled: new Map()}), [data])

  const {fields, rules} = useMemo(() => {
    const {fields, visibility, disabled, rules} = parsedDesign
    const fieldsCopy = new Map(fields)
    disabled.forEach((condition, key) => {
      fieldsCopy.set(key, {...fieldsCopy.get(key), disabled: condition(values)})
    })
    visibility.forEach((condition, key) => {
      if (!condition(values)) {
        fieldsCopy.delete(key)
      }
    })

    return {fields: Array.from(fieldsCopy.values()), rules}
  }, [values, parsedDesign])

  return (
    <ScrollBar className="w-full">
      <CustomValuesContext.Provider value={valuesCustom}>
        <RequisitesForm
          inputWrapper={DefaultWrapper}
          value={values}
          onInput={onFormInput}
          fields={fields}
          rules={rules}
        />
      </CustomValuesContext.Provider>
    </ScrollBar>
  )
}

Requisites.propTypes = {}

export default Requisites