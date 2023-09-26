import Select from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import Input from '@Components/Components/Inputs/Input'
import DatePicker from '@/Components/Inputs/DatePicker'
import CheckBox from '@/Components/Inputs/CheckBox'
import {
  URL_ENTITY_LIST,
  URL_REPORTS_BRUNCH,
  URL_REPORTS_DEPARTMENT,
  URL_TITLE_LIST,
} from '@/ApiList'
import refsTransmission from '@/RefsTransmission'
import DocumentSelect from '@/Components/Inputs/DocumentSelect'
import CustomValuesPipe from '@/Pages/Tasks/item/Pages/Requisites/PipeComponents/CustomValues'
import FiltersPipe from './Filters/index'
import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import TitleDocument from '@/Pages/Rporting/Components/TitleDocument'

const CustomOrgstructure = ({ onInput, value, res_author, ...props }) => {
  const [filter, setFilter] = useState()

  useEffect(() => {
    const val = filter?.map(({ emplId, fullDescription, userName }) => {
      return {
        [res_author ? 'res_author_label' : `${props.id}_label`]:
          fullDescription,
        [res_author ? 'res_author_dss_user_name' : `${props.id}_dss_user_name`]:
          userName,
        [res_author ? 'res_author' : 'emplId']: emplId,
      }
    })

    onInput(val, props.id)
  }, [filter, onInput, props.id, res_author])

  return (
    <UserSelect
      {...props}
      returnOption={true}
      returnObjects={true}
      value={filter}
      onInput={setFilter}
    />
  )
}

CustomOrgstructure.propTypes = {
  onInput: PropTypes.func,
  res_author: PropTypes.bool,
  id: PropTypes.string,
}

const CustomDatePicker = ({ onInput, value, ...props }) => {
  const [filter, setFilter] = useState([])
  const filterRef = useRef(filter)

  useEffect(() => {
    if (filter !== filterRef.current && Object.keys(filter).length) {
      const [before, after] = filter
      onInput(before, `${props.id}_before`)
      onInput(after, `${props.id}_after`)
      filterRef.current = filter
    }
  }, [filter, onInput, props.id, value])

  return (
    <DatePicker {...props} range={true} value={filter} onInput={setFilter} />
  )
}

CustomDatePicker.propTypes = {
  onInput: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  id: PropTypes.string,
}

const CustomCheckBox = ({ onInput, value, ...props }) => {
  const [filter, setFilter] = useState(props.id === 'only_original') //todo убрать харды , надо для отоброжения, ког

  useEffect(() => {
    onInput(filter, props.id)
  }, [props.id, onInput, value, filter])

  return <CheckBox {...props} value={filter} onInput={setFilter} />
}

CustomCheckBox.propTypes = {
  onInput: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.object,
  ]),
  id: PropTypes.string,
}

const loadFunctions = {
  default: (accumulator) => {
    const {
      backConfig: { dss_component_reference, dss_attr_name },
      nextProps,
      api,
    } = accumulator

    if (dss_component_reference) {
      nextProps.loadFunction = (filters) => async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          id: dss_attr_name,
          type: dss_component_reference,
          query,
          filters,
        })
        return data
      }
      const { valueKey, labelKey } = refsTransmission(dss_component_reference)
      nextProps.valueKey = valueKey
      nextProps.labelKey = labelKey
      nextProps.refKey = dss_component_reference
    }
  },
  Branch: (accumulator) => {
    const { nextProps, api, type } = accumulator

    nextProps.loadFunction =
      (filters) =>
      async (query, { source, controller } = {}) => {
        const {
          data: { content },
        } = await api.post(
          URL_REPORTS_BRUNCH,
          {
            type: 'branch_list',
            filter: {
              ...filters,
              query,
              useAllFilter: true,
            },
          },
          {
            cancelToken: source.token,
            signal: controller.signal,
          },
        )
        return content
      }
    const { valueKey, labelKey } = refsTransmission(type)
    nextProps.valueKey = valueKey
    nextProps.labelKey = labelKey
  },
  Department: (accumulator) => {
    const { nextProps, api, type } = accumulator

    nextProps.loadFunction =
      (filters) =>
      async (query, { source, controller } = {}) => {
        const {
          data: { content },
        } = await api.post(
          URL_REPORTS_DEPARTMENT,
          {
            type: 'branch_list',
            query,
            filter: {
              ...filters,
              useAllFilter: true,
            },
          },
          {
            cancelToken: source.token,
            signal: controller.signal,
          },
        )
        return content
      }
    const { valueKey, labelKey } = refsTransmission(type)
    nextProps.valueKey = valueKey
    nextProps.labelKey = labelKey
  },
  TitleDocument: (accumulator) => {
    const { nextProps, api, type } = accumulator
    nextProps.loadFunction =
      (filters) =>
      async (query, { source, controller } = {}) => {
        const { data } = await api.post(
          URL_TITLE_LIST,
          {
            query,
            ...filters,
          },
          {
            cancelToken: source.token,
            signal: controller.signal,
          },
        )
        return data
      }
    const { valueKey, labelKey } = refsTransmission(type)
    nextProps.valueKey = valueKey
    nextProps.labelKey = labelKey
  },
}

const getLoadFunction = (accumulator) => {
  const { type } = accumulator
  const { [type]: loadFunction = loadFunctions.default } = loadFunctions

  loadFunction(accumulator)
  return accumulator
}

const getMultiply = (accumulator) => {
  const {
    backConfig: { multiple },
    nextProps,
  } = accumulator
  nextProps.multiple = multiple
  return accumulator
}

const getRequired = (required) => {
  const {
    backConfig: { multiple },
    nextProps,
  } = required
  nextProps.multiple = multiple
  return required
}

export const propsTransmission = {
  Combobox: (accumulator) => {
    accumulator.nextProps.component = Select
    getLoadFunction(accumulator)
    getMultiply(accumulator)
    getRequired(accumulator)
    FiltersPipe(accumulator)
    return accumulator.nextProps
  },
  Date: (accumulator) => {
    accumulator.nextProps.component = CustomDatePicker
    return accumulator.nextProps
  },
  Checkbox: (accumulator) => {
    accumulator.nextProps.component = CustomCheckBox
    return accumulator.nextProps
  },
  InputString: (accumulator) => {
    accumulator.nextProps.component = Input
    return accumulator.nextProps
  },
  Orgstructure: (accumulator) => {
    accumulator.nextProps.component = CustomOrgstructure
    getMultiply(accumulator)
    getRequired(accumulator)
    return accumulator.nextProps
  },
  Branch: (accumulator) => {
    accumulator.nextProps.component = Select
    getLoadFunction(accumulator)
    getMultiply(accumulator)
    getRequired(accumulator)
    FiltersPipe(accumulator)
    return accumulator.nextProps
  },
  Department: (accumulator) => {
    accumulator.nextProps.component = Select
    getLoadFunction(accumulator)
    getMultiply(accumulator)
    getRequired(accumulator)
    FiltersPipe(accumulator)
    return accumulator.nextProps
  },
  TitleDocument: (accumulator) => {
    accumulator.nextProps.component = TitleDocument
    getLoadFunction(accumulator)
    getMultiply(accumulator)
    getRequired(accumulator)
    FiltersPipe(accumulator)
    return accumulator.nextProps
  },
  Document: (accumulator) => {
    accumulator.nextProps.component = DocumentSelect
    // getLoadFunction(accumulator)
    getMultiply(accumulator)
    CustomValuesPipe(accumulator)
    FiltersPipe(accumulator)
    accumulator.nextProps.filters = {
      type: accumulator.backConfig.dss_component_reference,
    }
    accumulator.nextProps.displayName = '${dss_description}'
    accumulator.nextProps.valueKey = 'id'
    accumulator.nextProps.labelKey = 'displayName'
    accumulator.nextProps.refKey = 'documentSelect'
    return accumulator.nextProps
  },
}
