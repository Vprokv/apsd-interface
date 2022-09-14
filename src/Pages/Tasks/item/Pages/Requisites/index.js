import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import ScrollBar from '@Components/Components/ScrollBar'
import DefaultWrapper from "@/Components/Fields/DefaultWrapper";
import {RequisitesForm} from "./styles";
import useTabItem from "../../../../../components_ocean/Logic/Tab/TabItem";
import {ApiContext, DocumentTypeContext, TASK_ITEM_DOCUMENT, TASK_ITEM_REQUISITES} from "../../../../../contants";
import {useParams} from "react-router-dom";
import {fieldsDictionary, NoFieldType} from "./constants";
import {readOnlyRules, validationRules, visibleRules} from './rules'


const regeGetRules = /[^&|]+|(&|\||.)\b/gm //rege to get rules and summ characters
const getRuleParams = /[^:,[\]\s$]+/gm // rege to get rule field and arguments
const regExpGetValidationRules = /[^&|]+\b/gm // rege to get validation rule and arguments

const Requisites = props => {
  const {type} = useParams()
  const documentType = useContext(DocumentTypeContext)
  const api = useContext(ApiContext)
  const {tabState: {data}, setTabState} = useTabItem({
    stateId: TASK_ITEM_REQUISITES
  })
  const {
    tabState: {data: documentData, data: {values} = {}}, setTabState: setDocumentState
  } = useTabItem({
    stateId: documentType
  })

  const onFormInput = useCallback((formData) => setDocumentState({data: { ...documentData, values: formData}}), [documentData, setDocumentState])

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
    attr: {
      dss_attr_label, dss_attr_name, dss_placeholder, dsb_readonly, dsb_multiply, dss_validation_rule,
      dss_visible_rule, dss_readonly_rule
    }
  }) => {
    if (dss_visible_rule) {
      const {args, condition, disabled} = dss_visible_rule.match(regeGetRules).reduce((acc, condition, i) => {
        if (i % 2 === 1) {
          acc.condition = `${acc.condition} ${condition}${condition}`
        } else {
          const [rule, id, ...values] = condition.match(getRuleParams)
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
      const [rule, id, values] = dss_readonly_rule.match(getRuleParams)
      // eslint-disable-next-line no-new-func
      if (!acc.disabled.has(dss_attr_name)) {
        acc.disabled.set(dss_attr_name,new Function(`{${id}} = {}`, `return ${readOnlyRules[rule](id, values)}`))
      }
    }
//TODO Разобраться с регуляркой с бека при создании нового документа
    // if (dss_validation_rule) {
    //   acc.rules[dss_attr_name] = dss_validation_rule.match(regExpGetValidationRules).map((rule) => {
    //     const [ruleName, ...args] = rule.match(getRuleParams)
    //     return validationRules[ruleName](...args)
    //   })
    // }

    acc.fields.set(dss_attr_name, {
      id: dss_attr_name,
      component: fieldsDictionary[type] || NoFieldType,
      label: dss_attr_label,
      placeholder: dss_placeholder,
      disabled: dsb_readonly,
      multiple: dsb_multiply,
      style: {
        gridColumn: `${col + 1}/${col + width + 1}`,
        gridRow: `grid-row: ${row + 1}/${row + height + 1}`
      }
    })

    return acc
  }, {fields: new Map(), rules: {}, visibility: new Map(), disabled: new Map()}), [data])

  const { fields, rules } = useMemo(() => {
    const { fields, visibility, disabled, rules } = parsedDesign
    const fieldsCopy = new Map(fields)
    disabled.forEach((condition, key) => {
      fieldsCopy.set(key, {...fieldsCopy.get(key), disabled: condition(values) })
    })
    visibility.forEach((condition, key) => {
      if (!condition(values)) {
        fieldsCopy.delete(key)
      }
    })

    return { fields: Array.from(fieldsCopy.values()), rules }
  }, [values, parsedDesign])

  return (
    <ScrollBar className="w-full">
      <RequisitesForm
        inputWrapper={DefaultWrapper}
        value={values}
        onInput={onFormInput}
        fields={fields}
        rules={rules}
      />
    </ScrollBar>
  );
};

Requisites.propTypes = {};

export default Requisites;