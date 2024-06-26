import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { OrgStructureWindowComponent, SelectedEmployeeContainer } from './style'
import { ApiContext, WINDOW_ADD_EMPLOYEE } from '@/contants'
import ScrollBar from '@Components/Components/ScrollBar'
import Button from '@/Components/Button'
import BaseCell from '../../ListTableComponents/BaseCell'
import BaseSubCell from '../../ListTableComponents/BaseSubCell'
import { FilterForm, SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import ListTable from '../../../components_ocean/Components/Tables/ListTable'
import RowComponent from '../../ListTableComponents/EmitValueRowComponent'
import HeaderCell from '../../ListTableComponents/HeaderCell'
import ModifiedSortCellComponent from '../../ListTableComponents/ModifiedSortCellComponent'
import { FlatSelect } from '../../../components_ocean/Components/Tables/Plugins/selectable'
import CheckBox from '../CheckBox'
import {
  URL_EMPLOYEE_LIST,
  URL_ORGSTURCTURE_BRANCHES,
  URL_ORGSTURCTURE_DEPARTMENTS,
  URL_ORGSTURCTURE_ORGANIZATIONS,
} from '@/ApiList'
import UserCard from './Components/UserCard'
import closeIcon from '../../../Icons/closeIcon'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { AutoLoadableSelect } from '../Select'
import Pagination from '../../Pagination'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useLoadableCache } from '@Components/Components/Inputs/Plugins/Loadable'
import { AddUserOptionsFullName } from '../UserSelect'
import usePagination from '../../../components_ocean/Logic/usePagination'
import useDefaultFilter from './useDefaultFilter'
import PropTypes from 'prop-types'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'

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

export const OrgStructureWindow = (props) => {
  const {
    onClose,
    value,
    onInput,
    loadFunction,
    filter,
    setFilter,
    options,
    onSort,
    sortQuery,
    pagination,
    valueKey,
    multiple,
    returnOption,
    id,
    sendValue,
    filterOptions,
  } = props

  const { setLimit, setPage, paginationState } = pagination

  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState(value)
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

  useEffect(() => onSort({ key: columns[0].id, direction: 'ASC' }), [onSort])

  const filterRef = useRef(filter)

  useEffect(() => {
    if (
      (!filter.branchId && filter.branchId?.length < 2) ||
      filterRef.current.branchId !== filter.branchId
    ) {
      // eslint-disable-next-line no-unused-vars
      setFilter(({ departmentId, ...item }) => item)
    }
  }, [filter.branchId, setFilter])

  useEffect(() => {
    if (
      !filter.organizationId ||
      filterRef.current.organizationId !== filter.organizationId
    ) {
      // eslint-disable-next-line no-unused-vars
      setFilter(({ branchId, ...item }) => item)
    }
  }, [filter.organization, filter.organizationId, filterRef, setFilter])

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
        id: 'organizationId',
        component: AutoLoadableSelect,
        valueKey: 'r_object_id',
        options: [
          ...(filterOptions?.organizationId || []),
          organizationOptions,
        ],
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
        disabled: !filter.organizationId,
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        options: [...(filterOptions?.branchId || []), ...branches],
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ORGSTURCTURE_BRANCHES, {
            id: filter.organizationId,
            query,
          })
          return data
        },
      },
      {
        id: 'departmentId',
        component: AutoLoadableSelect,
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
    [
      api,
      branches,
      filter.branchId,
      filter.organizationId,
      filterOptions?.branchId,
      filterOptions?.organizationId,
      organizationOptions,
    ],
  )

  useEffect(() => loadFunction(), [loadFunction])

  const onRemoveSelectedValue = useCallback(
    (id) => () =>
      setSelectState((prevValue) => {
        if (multiple) {
          const nextValue = Array.isArray(prevValue) ? [...prevValue] : []
          const findIndexFunc = returnOption
            ? ({ [valueKey]: objValueKey }) => objValueKey === id
            : (objValueKey) => objValueKey === id
          nextValue.splice(nextValue.findIndex(findIndexFunc), 1)
          return nextValue
        }
        return undefined
      }),
    [multiple, returnOption, valueKey],
  )

  const renderEmployee = useMemo(
    () =>
      valueKeys.map((value) => {
        const obj = cache.get(value)
        if (obj) {
          return (
            <div className="bg-form-input-color p-3 flex mb-2 min-" key={value}>
              <UserCard {...obj} widthDepartment={true} />
              <Button
                onClick={onRemoveSelectedValue(value)}
                type="button"
                className="ml-auto padding-null mb-auto height-small"
              >
                <Icon
                  icon={closeIcon}
                  size={10}
                  className="color-text-secondary"
                />
              </Button>
            </div>
          )
        }
      }),
    [valueKeys, cache, onRemoveSelectedValue],
  )

  const handleClick = useCallback(() => {
    onInput(selectState, id)
    sendValue({ valueKeys, cache })
    onClose()
  }, [onInput, selectState, id, sendValue, valueKeys, cache, onClose])

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
        } else {
          return obj
        }
      }),
    [multiple, valueKey],
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
    [multiple],
  )

  const handleSelectClick = useCallback(
    (obj) => () =>
      returnOption ? withOptions(obj) : withoutOptions(obj[valueKey]),
    [returnOption, valueKey, withOptions, withoutOptions],
  )

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex overflow-hidden  h-full">
        <SelectedEmployeeContainer>
          <ScrollBar className="pr-6 py-4">{renderEmployee}</ScrollBar>
        </SelectedEmployeeContainer>
        <div className="px-4 pb-4 overflow-hidden flex-container">
          <div className="flex items-center py-4">
            <FilterForm
              fields={fields}
              inputWrapper={EmptyInputWrapper}
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
                        component: ModifiedSortCellComponent,
                        downDirectionKey: 'DESC',
                      },
                      selectPlugin: {
                        driver: FlatSelect,
                        component: CheckBox,
                        style: { margin: 'auto 0' },
                        valueKey,
                        returnObjects: returnOption,
                      },
                      movePlugin: {
                        id: WINDOW_ADD_EMPLOYEE,
                        TableHeaderComponent: Header,
                        driver: useBackendColumnSettingsState,
                      },
                    }
                  : {
                      outerSortPlugin: {
                        component: ModifiedSortCellComponent,
                        downDirectionKey: 'DESC',
                      },
                      movePlugin: {
                        id: WINDOW_ADD_EMPLOYEE,
                        TableHeaderComponent: Header,
                        driver: useBackendColumnSettingsState,
                      },
                    },
              [multiple, returnOption, valueKey],
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
                onClick={onClose}
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
      </div>
    </div>
  )
}

OrgStructureWindow.propTypes = {
  onClose: PropTypes.func,
  sendValue: PropTypes.func,
  // todo value приходит как строка
  // меняю на описание как для строки
  // value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.string,
  onInput: PropTypes.func.isRequired,
  loadFunction: PropTypes.func.isRequired,
  filter: PropTypes.object,
  setFilter: PropTypes.func.isRequired,
  options: PropTypes.array,
  onSort: PropTypes.func.isRequired,
  sortQuery: PropTypes.object,
  pagination: PropTypes.object,
  valueKey: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  returnOption: PropTypes.bool,
  id: PropTypes.string.isRequired,
  filterOptions: PropTypes.object,
}

OrgStructureWindow.defaultProps = {
  onInput: () => null,
  onClose: () => null,
  sendValue: () => null,
  loadFunction: () => null,
  setFilter: () => null,
  onSort: () => null,
  filterOptions: {},
  filter: {},
  sortQuery: {},
  pagination: {},
  options: [],
  valueKey: '',
  id: '',
}

const OrgStructureWindowWrapper = ({
  onClose,
  open,
  filter: baseFilter,
  ...props
}) => {
  const api = useContext(ApiContext)
  const [paginationStateComp, setPaginationStateComp] = useState({})
  const [modalWindowOptions, setModalWindowOptions] = useState([])
  const defaultFilter = useDefaultFilter({ baseFilter })
  const [filter, setFilter] = useState({})
  const [sortQuery, onSort] = useState({})
  const getNotification = useOpenNotification()

  useEffect(
    () =>
      setFilter((filter) => {
        if (!Object.keys(filter) < 1) {
          return defaultFilter
        }

        return filter
      }),
    [defaultFilter],
  )

  const pagination = usePagination({
    stateId: WINDOW_ADD_EMPLOYEE,
    state: paginationStateComp,
    setState: setPaginationStateComp,
    defaultLimit: 10,
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
      const { limit, offset } = pagination.paginationState
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
  }, [api, filter, getNotification, pagination.paginationState, sort])

  const closeFunc = useCallback(() => {
    onClose()
    setFilter({ ...defaultFilter, ...baseFilter })
  }, [onClose, defaultFilter, baseFilter])

  return (
    <OrgStructureWindowComponent
      onClose={closeFunc}
      open={open}
      title="Добавление сотрудника"
      index={1001}
    >
      <OrgStructureWindow
        {...props}
        filter={filter}
        setFilter={setFilter}
        onSort={onSort}
        sortQuery={sortQuery}
        loadFunction={loadRef}
        pagination={pagination}
        options={modalWindowOptions}
        setModalWindowOptions={setModalWindowOptions}
        onClose={closeFunc}
      />
    </OrgStructureWindowComponent>
  )
}

OrgStructureWindowWrapper.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  filter: PropTypes.object,
  type: PropTypes.string,
  docId: PropTypes.string,
}

OrgStructureWindowWrapper.defaultProps = {
  open: () => null,
  onClose: () => null,
  type: undefined,
  docId: undefined,
  filter: {},
}

export default OrgStructureWindowWrapper
