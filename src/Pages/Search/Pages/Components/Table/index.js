import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import { useNavigate } from 'react-router-dom'
import { TabStateManipulation } from '@Components/Logic/Tab'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import ScrollBar from '@Components/Components/ScrollBar'

const fio = (f, i, o) => `${f} ${i} ${o}`

const columns = [
  {
    id: 'dss_reg_number',
    label: 'Шифр',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_reg_number = '' },
      },
    }) => <BaseCell value={dss_reg_number} />,
  },
  {
    id: 'dsdt_reg_date',
    label: 'Дата регистрации',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dsdt_reg_date = '' },
      },
    }) => <BaseCell value={dsdt_reg_date} />,
  },
  {
    id: 'dsdt_creation_date',
    label: 'Дата создания',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dsdt_creation_date = '' },
      },
    }) => <BaseCell value={dsdt_creation_date} />,
  },
  {
    id: 'dss_description',
    label: 'Краткое содержание',
    sizes: 300,
    component: ({
      ParentValue: {
        valuesCustom: { dss_description = '' },
      },
    }) => <BaseCell value={dss_description} />,
  },
  {
    id: 'dsid_signer_empl',
    label: 'Подписано',
    sizes: 200,
    component: ({
      ParentValue: {
        valuesCustom: {
          dsid_signer_empl: { lastName, firstName, middleName },
        },
      },
    }) => <BaseCell value={fio(lastName, firstName, middleName)} />,
  },
  {
    id: 'dss_status_display',
    label: 'Состояние',
    sizes: 200,
    component: ({
      ParentValue: {
        valuesCustom: { dss_status_display = '' },
      },
    }) => <BaseCell value={dss_status_display} />,
  },
]

const Table = () => {
  const {
    tabState: { searchValues = [] },
  } = useContext(TabStateContext)
  const { openNewTab } = useContext(TabStateManipulation)

  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    (id, type) => () => openNewTab(navigate(`/document/${id}/${type}`)),
    [navigate, openNewTab],
  )

  const rowComponent = useMemo(
    () => (props) =>
      <RowComponent onDoubleClick={handleDoubleClick} {...props} />,
    [handleDoubleClick],
  )

  return (
    <ScrollBar className="mx-4">
      {!!searchValues.length && (
        <ListTable
          rowComponent={rowComponent}
          headerCellComponent={HeaderCell}
          columns={columns}
          value={searchValues}
        />
      )}
    </ScrollBar>
  )
}

Table.propTypes = {}

export default Table
