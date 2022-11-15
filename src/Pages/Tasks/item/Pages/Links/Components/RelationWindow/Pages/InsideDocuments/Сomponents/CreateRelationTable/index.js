import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'

const columns = [
  {
    id: 'linkType',
    label: 'Тип связи',
    sizes: 200,
  },
  {
    id: 'type',
    label: 'Документ',
    sizes: 200,
  },
  {
    id: 'id',
    label: 'Комментарий',
    sizes: 200,
  },
]

const CreateRelationTable = ({ selected, view }) => {
  console.log(selected, 'selected')
  const [value, setValue] = useState(selected)

  console.log(value, 'value')

  return (
    view && (
      <ListTable
        headerCellComponent={HeaderCell}
        columns={columns}
        value={value}
      />
    )
  )
}

CreateRelationTable.propTypes = {}

export default CreateRelationTable
