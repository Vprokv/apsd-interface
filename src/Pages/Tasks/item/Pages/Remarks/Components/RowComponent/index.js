import styled from 'styled-components'
import React, { useMemo } from 'react'
import ListTable from '@Components/Components/Tables/ListTable'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import NumberComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/RowComponent/Components/NumberComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import UserComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/RowComponent/Components/UserComponent'
import MoreActionComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/MoreActionComponent'
import { ContHover } from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'
import PropTypes from 'prop-types'
import RemarkCheckBoxComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/RemarkCheckBoxComponent'

export const RowTableComponent = styled.div`
  &:hover {
    ${ContHover} {
      opacity: 1;
    }

    background-color: #e3e9f8;
  }
`

const columns = [
  {
    id: 'checkBox',
    label: '',
    component: ({ ParentValue: { props, itsRemark } }) =>
      itsRemark ? <RemarkCheckBoxComponent {...props} /> : <div />,
    sizes: 50,
  },
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
      ParentValue: {
        itsRemark,
        props: { remarkCreationDate, answerCreationDate },
      },
    }) => (
      <BaseCell value={itsRemark ? remarkCreationDate : answerCreationDate} />
    ),
    sizes: 180,
  },
  {
    id: 'remarkText',
    label: 'Значение / Ответ',
    className: 'flex items-center break-all',
    component: ({
      ParentValue: {
        itsRemark,
        props: { remarkText, answerText },
      },
    }) => <BaseCell value={itsRemark ? remarkText : answerText} />,
    sizes: 400,
  },
  {
    id: 'status',
    label: 'Статус',
    className: 'flex items-center',
    component: ({
      ParentValue: {
        itsRemark,
        props: { status },
      },
    }) => itsRemark && <BaseCell value={status} />,
    sizes: 120,
  },
  {
    id: 'remarkType',
    label: 'Тип замечания',
    component: ({
      ParentValue: {
        itsRemark,
        props: { remarkType },
      },
    }) => itsRemark && <BaseCell value={remarkType} />,
    sizes: 120,
  },
  {
    id: 'setRemark',
    label: 'Свод замечаний',
    component: ({
      ParentValue: {
        itsRemark,
        props: { setRemark },
      },
    }) => (
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
    component: ({ ParentValue: { props, itsRemark } }) =>
      itsRemark ? <MoreActionComponent {...props} /> : <div />,
    sizes: 120,
  },
]

const IterationRemarks = ({ remarks }) => {
  const data = useMemo(
    () =>
      remarks.reduce((acc, props) => {
        acc.push({
          itsRemark: true,
          props,
        })
        acc.push({
          itsRemark: false,
          props,
        })
        return acc
      }, []),
    [remarks],
  )

  const rowComponent = useMemo(
    () => (props) => <RowTableComponent {...props} />,
    [],
  )

  return (
    <ListTable
      rowComponent={rowComponent}
      value={data}
      columns={columns}
      headerCellComponent={HeaderCell}
      valueKey="id"
    />
  )
}

IterationRemarks.propTypes = {
  remarks: PropTypes.array,
}

export default IterationRemarks
