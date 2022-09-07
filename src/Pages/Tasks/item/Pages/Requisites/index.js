import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import ScrollBar from '@Components/Components/ScrollBar'
import DefaultWrapper from "@/Components/Fields/DefaultWrapper";
import {RequisitesForm} from "./styles";
import useTabItem from "../../../../../components_ocean/Logic/Tab/TabItem";
import {ApiContext, TASK_ITEM_DOCUMENT, TASK_ITEM_REQUISITES} from "../../../../../contants";
import {useParams} from "react-router-dom";
import {fieldsDictionary, NoFieldType} from "./constants";
import {visibleRules} from './rules'


const regeGetRules = /[^&|]+|(&|\||.)\b/gm //rege to get rules and summ characters
const getRuleParams = /[^:,[\]\s]+/gm // rege to get rule field and arguments

const Requisites = props => {
  const {type} = useParams()
  const api = useContext(ApiContext)
  const {tabState: {data}, setTabState} = useTabItem({
    stateId: TASK_ITEM_REQUISITES
  })
  const {
    tabState: {data: {values} = {}}, setTabState: setDocumentState
  } = useTabItem({
    stateId: TASK_ITEM_DOCUMENT
  })

  const onFormInput = useCallback((formData) => setDocumentState(formData), [setDocumentState])

  useEffect(async () => {
    const {data: {children}} = await api.post(`/sedo/type/config/${type}/design`)
    setTabState({data: children})
  }, [api, setTabState, type])
  const {fields, rules} = useMemo(() => (data || []).reduce((acc, {
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
          acc.disabled = {...acc.disabled, ...disabled}
          acc.args.add(id)
        }
        return acc
      }, {condition: "", disabled: {}, args: new Set()})
      // eslint-disable-next-line no-new-func
      acc.visibility[dss_attr_name] = new Function(`{${[...args].join(",")}} = {}`, `return ${condition}`)
      acc.disabled = {...acc.disabled, ...disabled}
    }

    if (dss_readonly_rule) {
      console.log(dss_readonly_rule)
    }
    acc.fields.push({
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
    // acc.rules[dss_attr_name] =
    return acc
  }, {fields: [], rules: {}, visibility: {}, disabled: {}}), [data])

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