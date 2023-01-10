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
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import { MultipleContext } from '@/Pages/Search/constans'

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
          dsid_signer_empl: { lastName = '', firstName = '', middleName = '' },
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
  const { multiple, setSelected, selected } = useContext(MultipleContext)

  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    ({ id, type }) =>
      () =>
        openNewTab(navigate(`/document/${id}/${type}`)),
    [navigate, openNewTab],
  )

  const rowComponent = useMemo(
    () => (props) =>
      <RowComponent onDoubleClick={handleDoubleClick} {...props} />,
    [handleDoubleClick],
  )

  const plugins = useMemo(
    () =>
      multiple
        ? {
            selectPlugin: {
              driver: FlatSelect,
              component: CheckBox,
              style: { margin: 'auto 0' },
              valueKey: 'id',
              returnObjects: true,
            },
          }
        : {},
    [multiple],
  )

  return (
    <ScrollBar className="mx-4">
      {!!searchValues.length && (
        <ListTable
          rowComponent={rowComponent}
          headerCellComponent={HeaderCell}
          columns={columns}
          value={searchValues}
          plugins={plugins}
          selectState={selected}
          onSelect={setSelected}
        />
      )}
    </ScrollBar>
  )
}

Table.propTypes = {}

export default Table
