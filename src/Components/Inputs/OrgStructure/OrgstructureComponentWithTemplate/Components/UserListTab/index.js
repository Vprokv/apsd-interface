import React, {

  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { ApiContext, WINDOW_ADD_EMPLOYEE } from '@/contants'
import useDefaultFilter from '@/Components/Inputs/OrgStructure/useDefaultFilter'
import { useOpenNotification } from '@/Components/Notificator'
import usePagination from '@Components/Logic/usePagination'
import {
  URL_EMPLOYEE_LIST,
  URL_ORGSTURCTURE_BRANCHES,
  URL_ORGSTURCTURE_DEPARTMENTS,
  URL_ORGSTURCTURE_ORGANIZATIONS,
} from '@/ApiList'
import { AddUserOptionsFullName } from '@/Components/Inputs/UserSelect'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { FilterForm, SearchInput } from '@/Pages/Tasks/list/styles'
import ListTable from '@Components/Components/Tables/ListTable'
import RowComponent from '@/Components/ListTableComponents/EmitValueRowComponent'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Pagination from '@/Components/Pagination'
import Button from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import LoadableSelect, { AutoLoadableSelect } from '@/Components/Inputs/Select'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useLoadableCache } from '@Components/Components/Inputs/Plugins/Loadable'
import UserCard from '@/Components/Inputs/OrgStructure/Components/UserCard'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import BaseSubCell from '@/Components/ListTableComponents/BaseSubCell'

const columns = [
  {
    id: 'position',
    label: 'ФИО, Должность',
    component: ({ ParentValue = {} } = {}) => UserCard(ParentValue),
    sizes: 250,
  },
  {
    id: 'department',
    label: 'Отдел',
    component: ({ ParentValue: { department } }) => (
      <BaseCell value={department} className="flex items-center h-full" />
    ),
    sizes: 230,
  },
  {
    id: 'organizations',
    label: 'Организация',
    component: ({ ParentValue: { organization } }) => (
      <BaseSubCell value={organization} subValue={organization} />
    ),
    sizes: 280,
  },
  {
    id: 'branch',
    label: 'Филиал',
    component: ({ ParentValue: { branch } }) => (
      <BaseSubCell value={branch} subValue={branch} />
    ),
    sizes: 180,
  },
]

const emptyWrapper = ({ children }) => children

const UserListTab = (props) => {
  const {
    onClose,
    baseFilter,
    onInput,
    options,
    setModalWindowOptions,
    valueKey,
    multiple,
    value,
    returnObjects,
    id,
    // sendValue,
    filterOptions,
    selectState,
    setSelectState,
  } = props

  const api = useContext(ApiContext)
  const defaultFilter = useDefaultFilter({ baseFilter })
  const [filter, setFilter] = useState(defaultFilter)
  const [sortQuery, onSort] = useState({})
  const getNotification = useOpenNotification()
  const [paginationStateComp, setPaginationStateComp] = useState({})
  const filterRef = useRef(filter)

  useEffect(
    () =>
      setFilter((val) => {
        if (Object.keys(val)?.length < 1) {
          filterRef.current = defaultFilter
          return defaultFilter
        } else {
          return val
        }
      }),
    [defaultFilter],
  )

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: WINDOW_ADD_EMPLOYEE,
    state: paginationStateComp,
    setState: setPaginationStateComp,
    defaultLimit: 10,
  })

  const {
    organization: [{ branches, ...organizationOptions }],
  } = useRecoilValue(userAtom)

  const { valueKeys, cache } = useLoadableCache({
    ...props,
    optionsMap: useMemo(
      () =>
        options.reduce((acc, item) => {
          acc[item[valueKey]] = item
          return acc
        }, {}),
      [valueKey, options],
    ),
    value: selectState,
  })

  const sort = useMemo(() => {
    const { key, direction } = sortQuery
    if (!key || !direction) {
      return []
    }

    return [
      {
        property: sortQuery.key,
        direction: sortQuery.direction,
      },
    ]
  }, [sortQuery])

  const loadRef = useCallback(async () => {
    try {
      const { limit, offset } = paginationState
      const {
        data: { content },
      } = await api.post(URL_EMPLOYEE_LIST, {
        filter,
        limit,
        offset,
        sort,
      })

      const data = content.map(AddUserOptionsFullName)

      setModalWindowOptions(data)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    filter,
    getNotification,
    paginationState,
    setModalWindowOptions,
    sort,
  ])

  const closeFunc = useCallback(() => {
    onClose()
    setSelectState(value)
    setFilter({ ...defaultFilter, ...baseFilter })
  }, [onClose, setSelectState, value, defaultFilter, baseFilter])

  useEffect(() => loadRef(), [loadRef])

  useEffect(() => {
    if (
      (!filter.branchId && filter.branchId?.length < 2) ||
      filterRef.current.branchId !== filter.branchId
    ) {
      // eslint-disable-next-line no-unused-vars
      setFilter(({ departmentId, ...item }) => item)
    }
  }, [filter.branchId])

  useEffect(() => {
    if (
      !filter.organization ||
      filterRef.current.organization !== filter.organization
    ) {
      // eslint-disable-next-line no-unused-vars
      setFilter(({ branchId, ...item }) => item)
    }
  }, [filter.organization, filterRef])

  const fields = useMemo(
    () => [
      {
        id: 'query',
        component: SearchInput,
        placeholder: 'Поиск',
        children: (
          <Icon
            icon={searchIcon}
            size={10}
            className="color-text-secondary mr-2.5"
          />
        ),
      },
      {
        id: 'organization',
        component: AutoLoadableSelect,
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        placeholder: 'Организация',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ORGSTURCTURE_ORGANIZATIONS, {
            query,
          })
          return data
        },
      },
      {
        id: 'branchId',
        placeholder: 'Филиал',
        component: AutoLoadableSelect,
        disabled: !filter.organization,
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ORGSTURCTURE_BRANCHES, {
            id: filter.organization,
            query,
          })
          return data
        },
      },
      {
        id: 'departmentId',
        component: LoadableSelect,
        disabled: !filter.branchId,
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        placeholder: 'Отдел',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ORGSTURCTURE_DEPARTMENTS, {
            branchIds: [filter.branchId],
            query,
          })
          return data
        },
      },
    ],
    [api, filter.branchId, filter.organization],
  )

  const handleClick = useCallback(() => {
    onInput(selectState, id)
    onClose()
  }, [onInput, selectState, id, onClose])

  const withOptions = useCallback(
    (obj) =>
      setSelectState((selectState) => {
        if (multiple) {
          const nextValue = selectState ? [...selectState] : []

          const valIncl = nextValue.find(
            ({ [valueKey]: key }) => key === obj[valueKey],
          )

          if (valIncl) {
            nextValue.splice(
              nextValue.findIndex(
                ({ [valueKey]: key }) => key === obj[valueKey],
              ),
              1,
            )
          } else {
            nextValue.push(obj)
          }
          return nextValue
        } else {
          return obj
        }
      }),
    [multiple, setSelectState, valueKey],
  )

  const withoutOptions = useCallback(
    (id) =>
      setSelectState((selectState) => {
        const nextValue = selectState ? [...selectState] : []
        const valIncl = nextValue.includes(id)

        if (multiple) {
          if (valIncl) {
            nextValue.splice(
              nextValue.findIndex((objValueKey) => objValueKey === id, 1),
            )
          } else {
            nextValue.push(id)
          }
          return nextValue
        } else {
          return id
        }
      }),
    [multiple, setSelectState],
  )

  const handleSelectClick = useCallback(
    (obj) => () =>
      returnObjects ? withOptions(obj) : withoutOptions(obj[valueKey]),
    [returnObjects, valueKey, withOptions, withoutOptions],
  )

  return (
    <div className="px-4 pb-4 overflow-hidden flex-container">
      <div className="flex items-center py-4">
        <FilterForm
          fields={fields}
          inputWrapper={emptyWrapper}
          value={filter}
          onInput={setFilter}
        />
      </div>
      <ListTable
        rowComponent={useMemo(
          () => (props) =>
            <RowComponent onClick={handleSelectClick} {...props} />,
          [handleSelectClick],
        )}
        value={options}
        columns={columns}
        plugins={useMemo(
          () =>
            multiple
              ? {
                  outerSortPlugin: {
                    component: SortCellComponent,
                    downDirectionKey: 'DESC',
                  },
                  selectPlugin: {
                    driver: FlatSelect,
                    component: CheckBox,
                    style: { margin: 'auto 0' },
                    valueKey,
                    returnObjects,
                  },
                }
              : {
                  outerSortPlugin: {
                    component: SortCellComponent,
                    downDirectionKey: 'DESC',
                  },
                },
          [multiple, returnObjects, valueKey],
        )}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={onSort}
        valueKey="id"
      />
      <div className="flex items-center">
        <Pagination
          className="mt-2 w-full "
          limit={paginationState.limit}
          page={paginationState.page}
          setLimit={setLimit}
          setPage={setPage}
        />
        <div className="flex items-center justify-end">
          <Button
            className="bg-light-gray flex items-center w-60 rounded-lg mr-4 justify-center"
            onClick={closeFunc}
          >
            Закрыть
          </Button>
          <Button
            className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center"
            onClick={handleClick}
          >
            Выбрать
          </Button>
        </div>
      </div>
    </div>
  )
}

UserListTab.propTypes = {}

export default UserListTab
