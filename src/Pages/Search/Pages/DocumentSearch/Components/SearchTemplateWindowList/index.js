import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
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
import Form, { EmptyInputWrapper } from '@Components/Components/Forms'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { useOpenNotification } from '@/Components/Notificator'
import usePagination from '@Components/Logic/usePagination'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import { URL_TEMPLATE_LIST } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Pagination from '@/Components/Pagination'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ColumnController from '@/Components/ListTableComponents/ColumnController'

const plugins = {
  outerSortPlugin: {
    component: ModifiedSortCellComponent,
    downDirectionKey: 'DESC',
  },
  selectPlugin: {
    driver: SingleSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'dsid_template',
    returnObjects: true,
  },
  movePlugin: {
    id: SETTINGS_TEMPLATES,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

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

const baseSortQuery = {
  key: 'type',
  direction: 'DESC',
}

const SearchTemplateWindowList = ({
  open,
  changeModalState,
  setGlobalFilter,
  type,
  title,
  searchFunc,
  reportId,
}) => {
  const api = useContext(ApiContext)
  const [{ filter, sortQuery = baseSortQuery, ...tabState }, setTabState] =
    useTabItem({ stateId: SETTINGS_TEMPLATES })
  const [selectState, setSelectState] = useState({})
  const getNotification = useOpenNotification()

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const loadData = useCallback(async () => {
    try {
      const { data } = await searchFunc(api)({
        ...filter,
        type,
        sort: [sortQuery],
      })(reportId)
      return data
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter, getNotification, reportId, searchFunc, sortQuery, type])

  const [{ data: content, total = 0, loading }] = useAutoReload(
    loadData,
    tabState,
    setTabState,
  )

  const onCreate = useCallback(() => {
    const jsonData = JSON.parse(selectState.dss_json) // TODO разобраться как хранит бэк

    setGlobalFilter(Array.isArray(jsonData) ? jsonData[0] : jsonData)
    changeModalState(false)()
  }, [changeModalState, selectState?.dss_json, setGlobalFilter])

  return (
    <StandardSizeModalWindow
      title={title}
      open={open}
      onClose={changeModalState(false)}
    >
      <WindowContainer>
        <div className="h-full">
          <div className="flex form-element-sizes-32">
            <FilterForm
              fields={filterFields}
              inputWrapper={EmptyInputWrapper}
              value={filter}
              onInput={useCallback(
                (filter) => setTabState({ filter }),
                [setTabState],
              )}
            />
            <div className="ml-auto">
              <ColumnController columns={columns} id={SETTINGS_TEMPLATES} />
            </div>
          </div>
          <ListTable
            className="mt-2  h-full"
            value={content}
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
              disabled={selectState && Object.keys(selectState).length < 1}
              rightFunc={onCreate}
            />
            {/* {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${total}`}*/}
          </Pagination>
        </div>
      </WindowContainer>
    </StandardSizeModalWindow>
  )
}

SearchTemplateWindowList.defaultProps = {
  searchFunc: (api) => (searchBody) => async () => {
    return await api.post(URL_TEMPLATE_LIST, searchBody)
  },
}

SearchTemplateWindowList.propTypes = {}

export default SearchTemplateWindowList
