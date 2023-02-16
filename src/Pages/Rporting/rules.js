import Select from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import Input from '@Components/Components/Inputs/Input'
import DatePicker from '@/Components/Inputs/DatePicker'
import CheckBox from '@/Components/Inputs/CheckBox'
import {URL_ENTITY_LIST, URL_REPORTS_BRUNCH, URL_REPORTS_DEPARTMENT} from '@/ApiList'
import refsTransmission from '@/RefsTransmission'
import DocumentSelect from "@/Components/Inputs/DocumentSelect";
import CustomValuesPipe from "@/Pages/Tasks/item/Pages/Requisites/PipeComponents/CustomValues";
import FiltersPipe from "@/Pages/Tasks/item/Pages/Requisites/PipeComponents/Filters";

const fields = {
  Department: Select,
  Document: Select,
  DocumentPicker: Select,
  TextualCombobox: Select,
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

const loadFunctions = {
  default: (accumulator) => {
    const {
      backConfig: { dss_component_reference, dss_attr_name },
      nextProps,
      api,
    } = accumulator

    if (dss_component_reference) {
      nextProps.loadFunction = async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          id: dss_attr_name,
          type: dss_component_reference,
          query,
          // filters,
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
    const { nextProps, api, type, user } = accumulator
    const { organization } = user

    nextProps.loadFunction = async (query) => {
      const {
        data: { content },
      } = await api.post(URL_REPORTS_BRUNCH, {
        type: 'branch_list',
        query,
        filter: {
          organizationId: organization[0]?.r_object_id,
        },
      })
      return content
    }
    const { valueKey, labelKey } = refsTransmission(type)
    nextProps.valueKey = valueKey
    nextProps.labelKey = labelKey
  },
  Department: (accumulator) => {
    const { nextProps, api, type, user } = accumulator

    const { organization, organization: [{ branches }] = [{}] } = user

    nextProps.loadFunction = async (query) => {
      const {
        data: { content },
      } = await api.post(URL_REPORTS_DEPARTMENT, {
        type: 'branch_list',
        query,
        filter: {
          dsid_organization: organization[0]?.r_object_id,
          branchId: branches[0]?.r_object_id,
        },
      })
      return content
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
    return accumulator.nextProps
  },
  Date: (accumulator) => {
    accumulator.nextProps.component = () => <DatePicker range={true} />
    return accumulator.nextProps
  },
  Checkbox: (accumulator) => {
    accumulator.nextProps.component = CheckBox
    return accumulator.nextProps
  },
  InputString: (accumulator) => {
    accumulator.nextProps.component = Input
    return accumulator.nextProps
  },
  Orgstructure: (accumulator) => {
    accumulator.nextProps.component = UserSelect
    getMultiply(accumulator)
    getRequired(accumulator)
    return accumulator.nextProps
  },
  Branch: (accumulator) => {
    accumulator.nextProps.component = Select
    getLoadFunction(accumulator)
    getMultiply(accumulator)
    getRequired(accumulator)
    return accumulator.nextProps
  },
  Department: (accumulator) => {
    accumulator.nextProps.component = Select
    getLoadFunction(accumulator)
    getMultiply(accumulator)
    getRequired(accumulator)
    return accumulator.nextProps
  },
  Document: (accumulator) => {
    accumulator.nextProps.component = DocumentSelect
    // getLoadFunction(accumulator)
    getMultiply(accumulator)
    CustomValuesPipe(accumulator)
    FiltersPipe(accumulator)
    // accumulator.nextProps.filters = {
    //   type: accumulator.backConfig.dss_component_reference[0],
    // }
    // accumulator.nextProps.displayName =
    //   accumulator.backConfig.dss_display_template
    accumulator.nextProps.valueKey = 'id'
    accumulator.nextProps.labelKey = 'displayName'
    accumulator.nextProps.refKey = 'documentSelect'
    return accumulator.nextProps
  },
}
