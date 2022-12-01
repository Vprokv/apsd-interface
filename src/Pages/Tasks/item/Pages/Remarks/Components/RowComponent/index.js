import styled from 'styled-components'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext } from '@/contants'
import { LoadContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import { URL_APPROVAL_SHEET_DELETE } from '@/ApiList'
import { Button } from '@Components/Components/Button'
import Icon from '@Components/Components/Icon'
import AddUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/AddUserIcon'
import editIcon from '@/Icons/editIcon'
import { LoadableBaseButton } from '@/Components/Button'
import deleteIcon from '@/Icons/deleteIcon'
import ListTable from '@Components/Components/Tables/ListTable'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import NumberComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/RowComponent/Components/NumberComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import UserComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/RowComponent/Components/UserComponent'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import BaseSubCell from '@/Components/ListTableComponents/BaseSubCell'

const Row = styled.div`
  height: 46px;
  background-color: var(--notifications);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--separator);
  align-content: center;
  //border-top: 1px solid var(--separator);
`

const plugins = {
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'remarkId',
  },
}

const columns = [
  {
    id: 'number',
    label: 'Номер',
    className: 'h-10 flex items-center',
    component: NumberComponent,
    sizes: 100,
  },
  {
    id: 'user',
    label: 'Участник/Подраздедение',
    className: 'h-10 flex items-center',
    component: UserComponent,
    sizes: 300,
  },
  {
    id: 'status',
    label: 'Статус',
    className: 'h-10 flex items-center',
    component: BaseCell,
    sizes: 150,
  },
  {
    id: 'remarkText',
    label: 'Значение',
    className: 'h-10 flex items-center',
    component: ({ ParentValue: { itsRemark, remarkText } }) => (
      <BaseCell value={itsRemark ? remarkText : ''} />
    ),
    sizes: 500,
  },
  {
    id: 'remarkType',
    label: 'Тип замечания',
    className: 'h-10 flex items-center',
    component: BaseCell,
    sizes: 250,
  },
  {
    id: 'setRemark',
    label: 'Свод замечаний',
    className: 'h-10 flex items-center',
    component: ({ ParentValue: { setRemark, itsRemark } }) => (
      <BaseCell
        value={
          itsRemark && setRemark
            ? 'Включено в свод замечаний'
            : itsRemark && !setRemark
            ? 'Не включено'
            : ''
        }
      />
    ),
    sizes: 250,
  },
]

const RowComponent = ({ children, setSelectState, selectState, ...props }) => {
  const data = useMemo(() => {
    const {
      remarkMemberFullName,
      remarkId,
      remarkMemberPosition,
      remarkType,
      remarkText,
      setRemark,
      number,
      ...item
    } = props

    return [
      {
        itsRemark: true,
        remarkMemberFullName,
        remarkId,
        number,
        remarkMemberPosition,
        remarkType,
        remarkText,
        setRemark,
      },
      { ...item, remarkText, remarkId },
    ]
  }, [props])

  return (
    <>
      <Row>{children}</Row>
      <ListTable
        value={data}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        // sortQuery={sortQuery}
        // onSort={onSort}
        valueKey="id"
      />
    </>
  )
}

RowComponent.propTypes = {}

export default RowComponent
