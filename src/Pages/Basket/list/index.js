import { useCallback, useContext, useMemo, useState } from 'react'
import {
  ApiContext,
  BASKET,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
} from '@/contants'
import { useLocation } from 'react-router-dom'
import {
  TabStateManipulation,
  useAutoReload,
  useSetTabName,
  useTabItem,
} from '@Components/Logic/Tab'
import usePagination from '@Components/Logic/usePagination'
import {
  URL_BASKET_DELETED,
  URL_BASKET_LIST,
  URL_BASKET_RESTORE_DELETED,
} from '@/ApiList'
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
import ListTable from '@Components/Components/Tables/ListTable'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Pagination from '@/Components/Pagination'
import BaseCell, {
  sizes as baseCellSize,
} from '@/Components/ListTableComponents/BaseCell'

import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import DeleteIcon from '@/Icons/deleteIcon'
import ExportIcon from '@/Icons/ExportIcon'
import Tips from '@/Components/Tips'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ColumnController from '@/Components/ListTableComponents/ColumnController'

const plugins = {
  outerSortPlugin: {
    component: ModifiedSortCellComponent,
    downDirectionKey: 'DESC',
  },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'documentId',
  },
  movePlugin: {
    id: BASKET,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const columns = [
  {
    id: 'docRegNum',
    label: 'Наименование',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'docRegDate',
    label: 'Дата создания',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'docStatus',
    label: 'Статус',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'docAuthorName',
    label: 'Автор',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'removerFullName',
    label: 'Удалил',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'removeDate',
    label: 'Дата удаления',
    component: BaseCell,
    sizes: baseCellSize,
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

const baseSortQuery = {
  key: 'creationDate',
  direction: 'DESC',
}

function BasketList() {
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const { search } = useLocation()

  const [{ filter, sortQuery = baseSortQuery, ...tabState }, setTabState] =
    useTabItem({ stateId: BASKET })

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: BASKET,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })
  const getNotification = useOpenNotification()
  const [selectState, setSelectState] = useState([])
  const handleDoubleClick = useCallback(
    ({ documentId, docType }) =>
      () =>
        openTabOrCreateNewTab(`/document/${documentId}/${docType}`),
    [openTabOrCreateNewTab],
  )

  useSetTabName(useCallback(() => TabNames[search] || 'Удаленные', [search]))

  const loadData = useCallback(async () => {
    try {
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
          ...filter,
        },
      })
      return data
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    getNotification,
    paginationState,
    search,
    sortQuery.direction,
    sortQuery.key,
    filter,
  ])

  const [{ data }] = useAutoReload(loadData, tabState, setTabState)

  console.log(data, 'data')

  const onDelete = useCallback(async () => {
    try {
      await api.post(URL_BASKET_DELETED, { documentIds: selectState })
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, getNotification, selectState])

  const onRestore = useCallback(async () => {
    try {
      await api.post(URL_BASKET_RESTORE_DELETED, { documentIds: selectState })
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, getNotification, selectState])

  return (
    <div className="px-4 pb-4 overflow-hidden flex-container">
      <div className="flex items-center">
        <Filter
          value={filter}
          onInput={useCallback(
            (filter) => setTabState({ filter }),
            [setTabState],
          )}
        />
        <div className="flex items-center color-text-secondary ml-auto">
          <Tips text="Убрать из удаленных">
            <ButtonForIcon
              className="mr-2"
              onClick={onRestore}
              disabled={!selectState.length}
            >
              <Icon icon={ExportIcon} />
            </ButtonForIcon>
          </Tips>
          <Tips text="Удалить">
            <ButtonForIcon onClick={onDelete} disabled={!selectState.length}>
              <Icon icon={DeleteIcon} />
            </ButtonForIcon>
          </Tips>
          <ColumnController columns={columns} id={BASKET} />
        </div>
      </div>
      <ListTable
        className="mt-2"
        rowComponent={useMemo(
          () => (props) =>
            <RowComponent onDoubleClick={handleDoubleClick} {...props} />,
          [handleDoubleClick],
        )}
        value={data}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={useCallback(
          (sortQuery) => setTabState({ sortQuery }),
          [setTabState],
        )}
      />
      <Pagination
        className="mt-2"
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
        total={0}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${
          paginationState.endItemValue
        }, всего ${0}`}
      </Pagination>
    </div>
  )
}

export default BasketList
