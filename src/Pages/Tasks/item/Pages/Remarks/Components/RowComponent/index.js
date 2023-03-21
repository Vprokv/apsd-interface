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
import MoreActionComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/MoreActionComponent'
import { ContHover } from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'

const Row = styled.div`
  background-color: var(--notifications);
  font-size: 12px;
  border-bottom: 1px solid var(--separator);
  align-content: center;
  justify-content: center;
`

export const RowTableComponent = styled.div`
  &:hover {
    ${ContHover} {
      opacity: 1;
    }
  }
`

const columns = [
  {
    id: 'number',
    label: 'Номер',
    className: 'min-h-10 flex items-center',
    component: NumberComponent,
    sizes: 70,
  },
  {
    id: 'user',
    label: 'Автор замечания / ответа',
    className: 'min-h-10 flex items-center',
    component: UserComponent,
    sizes: 250,
  },
  {
    id: 'date',
    label: 'Дата создания/ ответа',
    className: 'h-10 flex items-center',
    component: ({
      ParentValue: { itsRemark, remarkCreationDate, answerCreationDate },
    }) => (
      <BaseCell value={itsRemark ? remarkCreationDate : answerCreationDate} />
    ),
    sizes: 180,
  },
  {
    id: 'remarkText',
    label: 'Значение / Ответ',
    className: 'h-10 flex items-center',
    component: ({ ParentValue: { itsRemark, remarkText, answerText } }) => (
      <BaseCell value={itsRemark ? remarkText : answerText} />
    ),
    sizes: 400,
  },
  {
    id: 'status',
    label: 'Статус',
    className: 'h-10 flex items-center',
    component: BaseCell,
    sizes: 120,
  },
  {
    id: 'remarkType',
    label: 'Тип замечания',
    className: 'h-10 flex items-center',
    component: BaseCell,
    sizes: 120,
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
    sizes: 150,
  },
  {
    id: 'more',
    label: '',
    className: 'h-10 flex items-center',
    component: ({ ParentValue: { remarkCreationDate }, ParentValue }) =>
      remarkCreationDate ? <MoreActionComponent {...ParentValue} /> : <div />,
    sizes: 50,
  },
]

const RowComponent = ({
  children,
  setSelectState,
  selectState,
  toggleDisplayedFlag,
  isDisplayed,
  ...props
}) => {
  const data = useMemo(() => {
    const {
      remarkMemberFullName,
      remarkId,
      remarkMemberPosition,
      remarkType,
      remarkText,
      setRemark,
      remarkCreationDate,
      number,
      status,
      ...item
    } = props

    if (!remarkMemberFullName) {
      return []
    }

    return [
      {
        itsRemark: true,
        remarkMemberFullName,
        remarkCreationDate,
        remarkId,
        number,
        remarkMemberPosition,
        remarkType,
        remarkText,
        setRemark,
        status,
        props,
      },
      { ...item, remarkText, remarkId, props },
    ]
  }, [props])

  const rowComponent = useMemo(
    () => (props) => <RowTableComponent {...props} />,
    [],
  )

  return (
    data && (
      <div className="flex flex-col">
        <button type={'button'} onClick={toggleDisplayedFlag}>
          <Row>{children}</Row>
        </button>
        {isDisplayed && (
          <ListTable
            rowComponent={rowComponent}
            value={data}
            columns={columns}
            headerCellComponent={HeaderCell}
            selectState={selectState}
            onSelect={setSelectState}
            valueKey="id"
          />
        )}
      </div>
    )
  )
}

RowComponent.propTypes = {}

export default RowComponent
