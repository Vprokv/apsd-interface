import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'
import TextArea from '@Components/Components/Inputs/TextArea'

const CreateRelationTable = ({ value, setLink }) => {
  const api = useContext(ApiContext)

  const columns = useMemo(
    () => [
      {
        id: 'regNumber',
        label: 'Шифр/Рег.номер',
        sizes: 300,
        component: ({
          ParentValue: {
            values: { dss_reg_number = '', r_creation_date },
          },
        }) => (
          <BaseCell
            className="h-12 flex items-center"
            value={`${dss_reg_number} от ${r_creation_date}`}
          />
        ),
      },
      {
        id: 'description',
        className: 'flex items-center',
        label: 'Краткое содержание',
        component: ({
          ParentValue: {
            valuesCustom: { dss_description },
          },
        }) => (
          <BaseCell
            className="h-12 flex items-center"
            value={dss_description}
          />
        ),
        sizes: 250,
      },
      {
        label: 'Тип связи',
        id: 'linkType',
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        component: (props) => (
          <LoadableSelect
            {...props}
            valueKey="r_object_id"
            className="form-element-sizes-32"
            labelKey="dss_name"
            placeholder="Выберите тип связи"
            loadFunction={async (query) => {
              const { data } = await api.post(URL_ENTITY_LIST, {
                type: 'ddt_dict_link_type',
                query,
              })
              return data
            }}
          />
        ),
        sizes: 250,
      },
      {
        id: 'comment',
        label: 'Комментарий',
        className: 'h-12',
        component: TextArea,
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        sizes: 250,
      },
    ],
    [api],
  )

  return (
    <div className=" w-full my-4">
      {!!value?.length && (
        <ListTable
          onInput={setLink}
          headerCellComponent={HeaderCell}
          columns={columns}
          value={value}
        />
      )}
    </div>
  )
}

CreateRelationTable.propTypes = {
  setLink: PropTypes.func,
  value: PropTypes.array,
}

export default CreateRelationTable
