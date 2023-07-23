import Classification from '@/Pages/Tasks/item/Pages/Requisites/Components/Classification'
import Select from '@/Components/Inputs/Select'
import NoFieldType from '@/Components/NoFieldType'
import UserSelect from '@/Components/Inputs/UserSelect'
import Input from '@Components/Components/Inputs/Input'
import TextArea from '@Components/Components/Inputs/TextArea'
import DatePicker from '@/Components/Inputs/DatePicker'
import CheckBox from '@/Components/Inputs/CheckBox'
import { URL_ENTITY_LIST } from '@/ApiList'
import BaseUserSelect from '@/Components/Inputs/OrgStructure/BaseUserSelect'
import DateWithButton from '@/Pages/Search/Pages/Components/DateWithButton'
import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'

export const mapOfKeyRules = {
  Date: true,
}

const CustomDatePicker = ({ onInput, value, ...props }) => {
  const [filter, setFilter] = useState([])
  const filterRef = useRef(filter)

  const memo = useMemo(() => {
    let arr = []
    const [before, after] = filter

    before &&
      arr.push({
        attr: props.dss_attr_name,
        operator: 'GTE',
        arguments: [before],
      })

    after &&
      arr.push({
        attr: props.dss_attr_name,
        operator: 'LTE',
        arguments: [after],
      })

    return arr
  }, [filter, props.dss_attr_name])

  useEffect(() => {
    if (filter !== filterRef.current) {
      onInput(memo, props.id)

      filterRef.current = filter
    }
  }, [filter, memo, onInput, props.id, value])

  return (
    <DatePicker {...props} range={true} value={filter} onInput={setFilter} />
  )
}

CustomDatePicker.propTypes = {
  onInput: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  id: PropTypes.string,
}

const fields = {
  Classification: Classification,
  Combobox: Select,
  TextualCombobox: Select,
  DocStatus: NoFieldType,
  Orgstructure: (props) => <UserSelect valueKey="userName" {...props} />,
  UserSelect: (props) => <BaseUserSelect vakueKey="userName" {...props} />,
  // UserSelect:(props) =>  BaseUserSelect,
  Text: Input,
  TextArea: TextArea,
  Date: CustomDatePicker,
  Checkbox: CheckBox,
}

//Combobox
//Orgstructure
//Orgstructure
//Checkbox
//Date
//Branch
//Department
//Document
//DocumentPicker
//NoFieldType

export const getField = (type) => fields[type] ?? fields.DocStatus
export const getLoadFunction =
  (api) =>
  ({
    dss_component_reference,
    dss_reference_attr_label,
    dss_reference_attr,
  }) => {
    if (!dss_component_reference) {
      return {}
    }

    return {
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: dss_component_reference,
          query,
        })
        return data
      },
      valueKey: dss_reference_attr || 'r_object_id',
      labelKey: dss_reference_attr_label || 'dss_name',
    }
  }
