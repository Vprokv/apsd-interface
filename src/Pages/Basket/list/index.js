import PropTypes from 'prop-types'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import {
  ApiContext,
  BASKET,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
  TASK_LIST,
} from '@/contants'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useLocation } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import usePagination from '@Components/Logic/usePagination'
import { URL_BASKET_LIST, URL_DOCUMENT_ITEM } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import {
  DELETED_1,
  DELETED_3,
  DELETED_YEAR,
  TabNames,
} from '@/Pages/Basket/list/constans'
import dayjs from 'dayjs'
import Filter from '@/Pages/Tasks/list/Components/Filter'
import { ButtonForIcon } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import filterIcon from '@/Pages/Tasks/list/icons/filterIcon'
import sortIcon from '@/Pages/Tasks/list/icons/sortIcon'
import volumeIcon from '@/Pages/Tasks/list/icons/volumeIcon'
import XlsIcon from '@/Icons/XlsIcon'
import ListTable from '@Components/Components/Tables/ListTable'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Pagination from '@/Components/Pagination'
import DocumentState, {
  sizes as DocumentStateSizes,
} from '@/Components/ListTableComponents/DocumentState'
import VolumeState, {
  sizes as volumeStateSize,
} from '@/Components/ListTableComponents/VolumeState'
import BaseCell, {
  sizes as baseCellSize,
} from '@/Components/ListTableComponents/BaseCell'
import VolumeStatus, {
  sizes as volumeStatusSize,
} from '@/Components/ListTableComponents/VolumeStatus'
import UserCard, {
  sizes as useCardSizes,
} from '@/Components/ListTableComponents/UserCard'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
  },
}

const columns = [
  {
    id: 'task',
    label: 'Задание',
    component: DocumentState,
    sizes: DocumentStateSizes,
  },
  {
    id: 'volume',
    label: 'Том',
    component: VolumeState,
    sizes: volumeStateSize,
  },
  {
    id: 'documentDescription',
    label: 'Наименование тома',
    component: (props) => (
      <BaseCell
        className="flex items-center break-words break-all min-h-10"
        {...props}
      />
    ),
    sizes: baseCellSize,
  },
  {
    id: 'stageName',
    label: 'Этап',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'documentStatus',
    label: 'Статус тома',
    className: 'flex items-center',
    component: VolumeStatus,
    sizes: volumeStatusSize,
  },
  {
    id: 'fromAuthor',
    label: 'От кого',
    component: ({ ParentValue: { fromWhomEmployee } = {} }) =>
      fromWhomEmployee &&
      UserCard({
        name: fromWhomEmployee?.firstName,
        lastName: fromWhomEmployee?.lastName,
        middleName: fromWhomEmployee?.middleName,
        position: fromWhomEmployee?.position,
        avatar: fromWhomEmployee?.avatartId,
      }),
    sizes: useCardSizes,
  },
  {
    id: 'maintainer',
    label: 'Назначенный исполнитель',
    component: ({ ParentValue: { appointedExecutors } = {} }) =>
      appointedExecutors &&
      UserCard({
        name: appointedExecutors?.firstName,
        lastName: appointedExecutors?.lastName,
        middleName: appointedExecutors?.middleName,
        position: appointedExecutors?.position,
        avatar: appointedExecutors?.avatartId,
      }),
    sizes: useCardSizes,
  },
  {
    id: 'author',
    label: 'Автор',
    component: ({
      ParentValue: {
        creatorEmployee: {
          firstName = '',
          position = '',
          avatartId,
          lastName,
          middleName,
        },
      },
    }) =>
      UserCard({
        name: firstName,
        lastName: lastName,
        middleName: middleName,
        position: position,
        avatar: avatartId,
      }),
    sizes: useCardSizes,
  },
  {
    id: 'dueDate',
    label: 'Контрольный срок',
    // component: BaseCell,
    // sizes: baseCellSize,
  },
]

const timesMap = {
  [DELETED_1]: {
    from: dayjs().subtract(1, 'month').format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
    to: dayjs().format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
  },
  [DELETED_3]: {
    from: dayjs().subtract(3, 'month').format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
    to: dayjs().format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
  },
  [DELETED_YEAR]: {
    from: dayjs().subtract(1, 'year').format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
    to: dayjs().format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
  },
}

function BasketList(props) {
  const [sortQuery, onSort] = useState({
    key: 'creationDate',
    direction: 'DESC',
  })
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const { search } = useLocation()

  const tabBasketState = useTabItem({ stateId: BASKET })

  const {
    tabState,
    setTabState,
    tabState: { data: { content = [], total = 0 } = {} },
  } = tabBasketState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const [filter, setFilter] = useState({ readTask: false })
  const [selectState, setSelectState] = useState([])
  const handleDoubleClick = useCallback(
    ({ taskId, type }) =>
      () =>
        openTabOrCreateNewTab(`/task/${taskId}/${type}`),
    [openTabOrCreateNewTab],
  )

  useSetTabName(useCallback(() => TabNames[search] || 'Удаленные', [search]))

  const loadData = useCallback(async () => {
    const { limit, offset } = paginationState

    const { data } = await api.post(URL_BASKET_LIST, {
      limit,
      offset,
      sort: [
        {
          direction: sortQuery.direction,
          property: sortQuery.key,
        },
      ],
      filter: {
        movedDate: timesMap[search],
      },
    })

    console.log(data, 'data')
    return data
  }, [api, paginationState, search, sortQuery.direction, sortQuery.key])

  useAutoReload(loadData, tabBasketState)

  return (
    <div className="px-4 pb-4 overflow-hidden flex-container">
      <div className="flex items-center">
        <Filter value={filter} onInput={setFilter} />
        <div className="flex items-center color-text-secondary ml-auto">
          <ButtonForIcon className="mr-2">
            <Icon icon={filterIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="mr-2">
            <Icon icon={sortIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="mr-2">
            <Icon icon={volumeIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="color-green">
            <Icon icon={XlsIcon} />
          </ButtonForIcon>
        </div>
      </div>
      <ListTable
        className="mt-2"
        rowComponent={useMemo(
          () => (props) =>
            <RowComponent onDoubleClick={handleDoubleClick} {...props} />,
          [handleDoubleClick],
        )}
        value={content}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={onSort}
      />
      <Pagination
        className="mt-2"
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
        total={total}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${total}`}
      </Pagination>
    </div>
  )
}

BasketList.propTypes = {}

export default BasketList
