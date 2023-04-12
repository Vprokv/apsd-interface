import {
  FilterObjectsWindowComponent,
  FilterWindowForm,
} from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow/styled'
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'
import { SecondaryGreyButton } from '@/Components/Button'

const FilterWindow = ({ filter, setFilterValue }) => {
  const api = useContext(ApiContext)

  const filterFormConfig = [
    {
      id: 'name',
      component: SearchInput,
      placeholder: 'Наименование',
      children: (
        <Icon
          icon={searchIcon}
          size={10}
          className="color-text-secondary mr-2.5"
        />
      ),
    },
    {
      id: 'typeId',
      component: LoadableSelect,
      placeholder: 'Тип объекта',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_dict_tech_obj_type_catalog',
          query,
        })
        return data
      },
    },
    {
      id: 'voltageId',
      component: LoadableSelect,
      placeholder: 'Класс напряжения',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_dict_voltage',
          query,
        })
        return data
      },
    },
    {
      id: 'resId',
      component: LoadableSelect,
      placeholder: 'РЭС',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_dict_res',
          query,
        })
        return data
      },
    },
    {
      id: 'branchId',
      component: LoadableSelect,
      placeholder: 'Балансодержатель',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_branch',
          query,
        })
        return data
      },
    },
  ]
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex overflow-hidden w-full h-full">
        <FilterWindowForm
          fields={filterFormConfig}
          inputWrapper={emptyWrapper}
          value={filter}
          onInput={setFilterValue}
        />
      </div>

      <div className="flex items-center justify-end">
        <SecondaryGreyButton onClick={() => setFilterValue({})}>
          Очистить фильтр
        </SecondaryGreyButton>
      </div>
    </div>
  )
}

FilterWindow.propTypes = {
  filter: PropTypes.object.isRequired,
  setFilterValue: PropTypes.func.isRequired,
}

const FilterWindowWrapper = (props) => (
  <FilterObjectsWindowComponent {...props} title="Фильтры">
    <FilterWindow {...props} />
  </FilterObjectsWindowComponent>
)

export default FilterWindowWrapper
