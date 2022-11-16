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

const CreateRelationTable = ({ selected, value, setValue }) => {
  console.log(selected, 'selected')

  return (
    !!value?.length && (
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
