import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import DocumentDescription from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/InsideDocuments/Сomponents/CreateRelationTable/Components/DocumentDescription'
import LinkType from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/InsideDocuments/Сomponents/CreateRelationTable/Components/Input'
import { StateRelationContext } from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/constans'
import Comment from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/InsideDocuments/Сomponents/CreateRelationTable/Components/Comment'
import BaseCell from '@/Components/ListTableComponents/BaseCell'

const columns = [
  {
    id: 'childId',
    label: 'ID Документа',
    sizes: 200,
    component: ({
      ParentValue: {
        id,
        // values: { id },
      },
    }) => <BaseCell value={id} />,
  },
  {
    id: 'regNumber',
    label: 'Шифр/Рег.номер',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_reg_number = '' },
      },
    }) => <BaseCell value={dss_reg_number} disabled />,
  },
  {
    id: 'linkType',
    label: 'Тип связи',
    sizes: 250,
    component: LinkType,
  },

  {
    id: 'comment',
    label: 'Комментарий',
    sizes: 250,
    component: Comment,
  },
]

const CreateRelationTable = ({ value }) => {
  return (
    <>
      {!!value?.length && (
        <ListTable
          headerCellComponent={HeaderCell}
          columns={columns}
          value={value}
        />
      )}
    </>
  )
}

CreateRelationTable.propTypes = {}

export default CreateRelationTable
