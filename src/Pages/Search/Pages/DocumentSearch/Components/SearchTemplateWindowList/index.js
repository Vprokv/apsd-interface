import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { SingleSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import BaseCell, {
  sizes as baseCellSize,
} from '@/Components/ListTableComponents/BaseCell'
import BaseCellName from '@/Pages/Tasks/item/Pages/Subscription/Components/CreateSubscriptionWindow/Components/BaseCellName'
import dayjs from 'dayjs'
import {
  ApiContext,
  DEFAULT_DATE_FORMAT,
  PRESENT_DATE_FORMAT,
  SETTINGS_TEMPLATES,
  TASK_LIST,
} from '@/contants'
import styled from 'styled-components'
import Form from '@Components/Components/Forms'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { TemplateTabStateContext } from '@/Pages/Settings/Components/Templates/constans'
import { useOpenNotification } from '@/Components/Notificator'
import usePagination from '@Components/Logic/usePagination'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import { URL_TEMPLATE_LIST } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Pagination from '@/Components/Pagination'
import UnderButtons from '@/Components/Inputs/UnderButtons'

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: SingleSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'dsid_template',
    returnObjects: true,
  },
}

const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 200px 200px 200px 200px 150px;
  grid-column-gap: 0.5rem;
`

const WindowContainer = styled.div`
  height: inherit;
  width: 100%;
`

const columns = [
  {
    id: 'dss_name',
    label: 'Наименование',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'dss_note',
    label: 'Примечание',
    component: BaseCell,
    sizes: 400,
  },
  {
    id: 'eventName',
    label: 'Автор',
    component: ({ ParentValue: { author } }) => (
      <BaseCellName value={author} className="font-size-12" />
    ),
    sizes: baseCellSize,
  },
  {
    id: 'eventName',
    label: 'Дата создания',
    component: ({ ParentValue: { r_creation_date } }) => (
      <BaseCell
        value={
          r_creation_date &&
          dayjs(r_creation_date, DEFAULT_DATE_FORMAT).format(
            PRESENT_DATE_FORMAT,
          )
        }
        className="flex items-center"
      />
    ),
    sizes: baseCellSize,
  },
]

const SearchTemplateWindowList = ({
  open,
  changeModalState,
  setGlobalFilter,
}) => {
  const api = useContext(ApiContext)
  const tabItemState = useTabItem({ stateId: SETTINGS_TEMPLATES })
  const [selectState, setSelectState] = useState({})
  const [filter, setFilter] = useState({})
  const getNotification = useOpenNotification()
  const [sortQuery, onSort] = useState({
    key: 'creationDate',
    direction: 'DESC',
  })

  const {
    // tabState: { data: { content = [], total = 0 } = {} },
    tabState: { data: content, total = 0, loading },
    tabState,
    setTabState,
  } = tabItemState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const filterFields = [
    {
      id: 'name',
      component: SearchInput,
      placeholder: 'Наименование',
      children: (
        <Icon
          icon={searchIcon}
          size={10}
          className="color-text-secondary mr-2.5"
        />
      ),
    },
    {
      id: 'note',
      component: SearchInput,
      placeholder: 'Примечание',
      children: (
        <Icon
          icon={searchIcon}
          size={10}
          className="color-text-secondary mr-2.5"
        />
      ),
    },
    {
      id: 'isPrivate',
      component: CheckBox,
      text: 'Личные шаблоны',
    },
  ]

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_TEMPLATE_LIST, {
        ...filter,
        type: 'ddt_query_template',
        sort: [
          {
            key: 'r_creation_date',
            direction: 'DESC',
          },
        ],
      })
      return data
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter, getNotification])

  useAutoReload(loadData, tabItemState)

  const onCreate = useCallback(() => {
    setGlobalFilter(JSON.parse(selectState.dss_json))
    changeModalState(false)()
  }, [changeModalState, selectState.dss_json, setGlobalFilter])

  return (
    <StandardSizeModalWindow
      title="Выберите шаблон поиска"
      open={open}
      onClose={changeModalState(false)}
    >
      <WindowContainer>
        <div className="h-full">
          <div className="flex form-element-sizes-32">
            <FilterForm
              fields={filterFields}
              inputWrapper={emptyWrapper}
              value={filter}
              onInput={setFilter}
            />
          </div>
          <ListTable
            className="mt-2  h-full"
            // rowComponent={useMemo(
            //   () => (props) => <RowComponent onClick={onOpen} {...props} />,
            //   [onOpen],
            // )}
            value={content}
            columns={columns}
            plugins={plugins}
            headerCellComponent={HeaderCell}
            selectState={selectState}
            onSelect={setSelectState}
            sortQuery={sortQuery}
            onSort={onSort}
            loading={loading}
          />
          <Pagination
            className="mt-2"
            limit={paginationState.limit}
            page={paginationState.page}
            setLimit={setLimit}
            setPage={setPage}
            total={total}
          >
            <UnderButtons
              leftStyle="width-min mr-2"
              rightStyle="width-min"
              leftFunc={changeModalState(false)}
              leftLabel="Закрыть"
              rightLabel="Выбрать"
              disabled={Object.keys(selectState).length < 1}
              rightFunc={onCreate}
            />
            {/*{`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${total}`}*/}
          </Pagination>
        </div>
      </WindowContainer>
    </StandardSizeModalWindow>
  )
}

SearchTemplateWindowList.propTypes = {}

export default SearchTemplateWindowList
