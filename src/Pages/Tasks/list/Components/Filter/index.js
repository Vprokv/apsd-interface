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
import CheckBox from '@/Components/Inputs/CheckBox'

const emptyWrapper = ({ children }) => children

function Filter({ value, onInput }) {
  const api = useContext(ApiContext)

  const fields = useMemo(
    () => [
      {
        id: 'readTask',
        component: CheckBox,
        label: 'Непросмотренные',
      },
      {
        id: 'taskTypes',
        component: LoadableSelect,
        multiple: true,
        placeholder: 'Тип задания',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const {
            data: { taskTypes },
          } = await api.post(URL_TASK_LIST_FILTERS, {
            filter: { ...value, readTask: !value.readTask },
          })

          return taskTypes.map((val) => {
            return { dss_name: val }
          })
        },
      },
      // {
      //   id: 'docTypes',
      //   component: LoadableSelect,
      //   placeholder: 'Вид тома',
      //   valueKey: 'dss_name',
      //   labelKey: 'dss_name',
      //   loadFunction: async () => {
      //     const {
      //       data: { taskTypes },
      //     } = await api.post(URL_TASK_LIST_FILTERS, {
      //       filter: value,
      //     })
      //
      //     return taskTypes.map((val) => {
      //       return { dss_name: val }
      //     })
      //   },
      // },
      {
        id: 'stageNames',
        component: LoadableSelect,
        placeholder: 'Этап',
        multiple: true,
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const {
            data: { stageNames },
          } = await api.post(URL_TASK_LIST_FILTERS, {
            filter: { ...value, readTask: value.unread },
          })

          return stageNames.map((val) => {
            return { dss_name: val }
          })
        },
      },
      {
        id: 'documentStatus',
        component: LoadableSelect,
        placeholder: 'Статус',
        multiple: true,
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const {
            data: { documentStatus },
          } = await api.post(URL_TASK_LIST_FILTERS, {
            filter: { ...value, readTask: value.unread },
          })

          return documentStatus.map((val) => {
            return { dss_name: val }
          })
        },
      },
      {
        id: 'searchQuery',
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
    [api, value],
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
