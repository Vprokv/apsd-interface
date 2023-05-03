import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow/styled'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_TYPE_CONFIG } from '@/ApiList'
import { ApiContext } from '@/contants'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'

const NotificationItem = (props) => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({})
  const fields = [
    {
      id: 1,
      label: 'Тип документа',
      component: LoadableSelect,
      valueKey: 'typeName',
      labelKey: 'typeLabel',
      options: [
        {
          typeName: 'ddt_project_calc_type_doc',
          typeLabel: 'Том',
        },
      ],
      loadFunction: async () => {
        const { data } = await api.post(URL_TYPE_CONFIG, {
          // typeConfig: 'ddt_startup_complex_type_doc',
        })
        return data
      },
    },
  ]

  return (
    <div className="m-4">
      <FilterForm
        fields={fields}
        inputWrapper={emptyWrapper}
        value={filter}
        onInput={setFilter}
      />
    </div>
  )
}

NotificationItem.propTypes = {}

export default NotificationItem
