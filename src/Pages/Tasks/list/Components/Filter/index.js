import { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { FilterForm, SearchInput } from '../../styles'
import Switch from '@/Components/Inputs/Switch'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import { ApiContext } from '@/contants'
import { URL_ENTITY_LIST, URL_TASK_LIST_FILTERS } from '@/ApiList'
import { DOCUMENT_TYPE, TASK_TYPE } from '../../constants'
import CheckBox from "@/Components/Inputs/CheckBox";

const emptyWrapper = ({ children }) => children

function Filter({ value, onInput }) {
  const api = useContext(ApiContext)

  const fields = useMemo(
    () => [
      {
        id: 'unread',
        component: CheckBox,
        label: 'Непросмотренные',
      },
      {
        id: 'taskTypes',
        component: LoadableSelect,
        placeholder: 'Тип задания',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { data } = await api.post(URL_TASK_LIST_FILTERS, {
            filterType: ['taskTypes'],
          })
          return data
        },
      },
      {
        id: 'docTypes',
        component: LoadableSelect,
        placeholder: 'Вид тома',
        valueKey: 'dss_type_name',
        labelKey: 'dss_type_label',
        loadFunction: async () => {
          const { data } = await api.post(URL_TASK_LIST_FILTERS, {
            filterType: ['docTypes'],
          })
          return data
        },
      },
      {
        id: 'stageId',
        component: LoadableSelect,
        placeholder: 'Этап',
        loadFunction: async () => {
          const { data } = await api.post(URL_TASK_LIST_FILTERS, {
            filterType: ['stageId'],
          })
          return data
        },
      },
      {
        id: 'documentStatus',
        component: LoadableSelect,
        placeholder: 'Статус',
        loadFunction: async () => {
          const { data } = await api.post(URL_TASK_LIST_FILTERS, {
            filterType: ['documentStatus'],
          })
          return data
        },
      },
      {
        id: 'description',
        component: SearchInput,
        placeholder: 'Поиск',
        children: (
          <Icon
            icon={searchIcon}
            size={10}
            className="color-text-secondary mr-2.5"
          />
        ),
      },
    ],
    [api],
  )

  return (
    <FilterForm
      fields={fields}
      inputWrapper={emptyWrapper}
      value={value}
      onInput={onInput}
    />
  )
}

Filter.propTypes = {
  value: PropTypes.object.isRequired,
  onInput: PropTypes.func.isRequired,
}

export default Filter
