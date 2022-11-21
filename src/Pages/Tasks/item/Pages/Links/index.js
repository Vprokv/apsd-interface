import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_LINK } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_ENTITY_LIST, URL_LINK_DELETE, URL_LINK_LIST } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import { FilterForm } from './styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { ButtonForIcon, SecondaryBlueButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import EditIcon from '@/Icons/editIcon'
import DeleteIcon from '@/Icons/deleteIcon'
import ListTable from '@Components/Components/Tables/ListTable'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import LinksWindow from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow'
import EditLinksWindow from '@/Pages/Tasks/item/Pages/Links/Components/EditLinksWindow'
import DownloadIcon from '@/Icons/DownloadIcon'

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'contentId',
    returnObjects: true,
  },
}

const columns = [
  {
    id: 'documentTypeLabel',
    label: 'Документ',
    className: 'h-10 flex items-center',
    component: BaseCell,
    sizes: 195,
  },
  {
    id: 'description',
    label: 'Краткое содержание',
    component: BaseCell,
    sizes: 215,
  },
  {
    id: 'authorFullName',
    label: 'Автор',
    component: BaseCell,
    sizes: 150,
  },
  {
    id: 'stageName',
    label: 'Этап',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'comment',
    label: 'Комментарий',
    component: BaseCell,
    sizes: 220,
  },
  {
    id: 'linkDate',
    label: 'Дата связи',
    component: BaseCell,
    sizes: 220,
  },
  {
    id: 'linkType',
    label: 'Тип связи',
    component: BaseCell,
    sizes: 220,
  },
]

const searchValues = [
  {
    linkId: 'asasa',
    contentId: 'axdsdsasa',
    linkType: 'Во исполнение',
    stageName: 'asdfsvsasa',
    linkDate: '18.11.2022',
    authorFullName: 'asasas',
    description: 'asasdsdcda',
    regNumber: 'ascsdcasa',
    regDate: 'assdcsdcdasa',
    documentTypeLabel: 'Договор 2',
    comment: 'csdcsdc',
  },
  {
    linkId: 'asqwqwqwqasa',
    contentId: 'asasa',
    linkType: 'Подписание',
    stageName: 'asasa',
    linkDate: '18.11.2022',
    authorFullName: 'asasa',
    description: 'asasa',
    regNumber: 'asasa',
    regDate: 'asasa',
    documentTypeLabel: 'Договор',
    comment: 'asasa',
  },
]

const Links = () => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const [filter, setFilterValue] = useState({})
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({})

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_LINK,
  })
  const {
    tabState,
    setTabState,
    tabState: { data = [], change = true },
  } = tabItemState

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_LINK_LIST, {
      parentId: id,
      filter,
    })

    return searchValues
  }, [api, id, type, change])

  useAutoReload(loadData, tabItemState)

  console.log(filter, 'filter')

  const fields = useMemo(
    () => [
      {
        id: 'documentType',
        component: LoadableSelect,
        placeholder: 'Тип документа',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        // loadFunction: async () => {
        //   const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
        //   return data
        // },
      },
      {
        id: 'authorName',
        component: UserSelect,
        placeholder: 'Автор связи',
        valueKey: 'userName',
      },
      {
        id: 'linkType',
        component: LoadableSelect,
        placeholder: 'Тип связи',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_link_type',
          })
          return data
        },
      },
    ],
    [api],
  )

  const onDelete = useCallback(async () => {
    await api.post(URL_LINK_DELETE, { linkIds: selectState })
  }, [api, selectState])

  return (
    <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
      <div className="flex items-center py-4 form-element-sizes-32">
        <FilterForm
          className="mr-2"
          value={filter}
          onInput={setFilterValue}
          fields={fields}
          inputWrapper={EmptyInputWrapper}
        />
        <div className="flex items-center ml-auto">
          <LinksWindow />
          <ButtonForIcon className="mr-2 color-text-secondary">
            <Icon icon={DownloadIcon} />
          </ButtonForIcon>
          <EditLinksWindow value={selectState} />
          <ButtonForIcon
            onClick={onDelete}
            disabled={!selectState.length}
            className="color-text-secondary"
          >
            <Icon icon={DeleteIcon} />
          </ButtonForIcon>
        </div>
      </div>
      <ListTable
        rowComponent={useMemo(
          () => (props) =>
            <RowComponent onDoubleClick={() => null} {...props} />,
          [],
        )}
        value={data}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={onSort}
        valueKey="id"
      />
    </div>
  )
}

Links.propTypes = {}

export default Links
