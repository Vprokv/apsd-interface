import { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { FilterForm, SearchInput } from '../../styles'
import Switch from '@/Components/Inputs/Switch'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import { ApiContext } from '@/contants'
import { URL_ENTITY_LIST } from '@/ApiList'
import { DOCUMENT_TYPE, TASK_TYPE } from '../../constants'

const emptyWrapper = ({ children }) => children

function Filter({ value, onInput }) {
  const api = useContext(ApiContext)

  const fields = useMemo(
    () => [
      {
        id: '1',
        component: Switch,
        label: 'Непросмотренные',
      },
      {
        id: '2',
        component: LoadableSelect,
        placeholder: 'Тип задания',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
          return data
        },
      },
      {
        id: '3',
        component: LoadableSelect,
        placeholder: 'Вид тома',
        valueKey: 'dss_type_name',
        labelKey: 'dss_type_label',
        loadFunction: async () => {
          const { data } = await api.post(`${URL_ENTITY_LIST}/${DOCUMENT_TYPE}`)
          return data
        },
      },
      {
        id: '4',
        component: Select,
        placeholder: 'Этап',
        options: [
          {
            ID: 'ASD',
            SYS_NAME: 'TT',
          },
          {
            ID: 'ASD1',
            SYS_NAME: 'TT2',
          },
        ],
      },
      {
        id: '5',
        component: Select,
        placeholder: 'Статус',
        options: [
          {
            ID: 'ASD',
            SYS_NAME: 'TT',
          },
          {
            ID: 'ASD1',
            SYS_NAME: 'TT2',
          },
        ],
      },
      {
        id: '6',
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
