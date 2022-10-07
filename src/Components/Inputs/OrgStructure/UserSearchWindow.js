import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react"
import {OrgStructureWindowComponent, SelectedEmployeeContainer} from "./style"
import {ApiContext} from "@/contants"
import ScrollBar from '@Components/Components/ScrollBar'
import Button from "@/Components/Button"
import BaseCell, {sizes as baseCellSize} from "../../ListTableComponents/BaseCell"
import BaseSubCell, {sizes as baseSubCellSize} from "../../ListTableComponents/BaseSubCell"
import {FilterForm, SearchInput} from "../../../Pages/Tasks/list/styles"
import Icon from '@Components/Components/Icon'
import searchIcon from "@/Icons/searchIcon"
import ListTable from "../../../components_ocean/Components/Tables/ListTable"
import RowComponent from "./Components/RowComponent"
import HeaderCell from "../../ListTableComponents/HeaderCell"
import SortCellComponent from "../../ListTableComponents/SortCellComponent"
import {FlatSelect} from "../../../components_ocean/Components/Tables/Plugins/selectable"
import CheckBox from "../CheckBox"
import {
  URL_ORGSTURCTURE_BRANCHES,
  URL_ORGSTURCTURE_DEPARTMENTS,
  URL_ORGSTURCTURE_ORGANIZATIONS
} from "../../../ApiList";
import UserCard from "./Components/UserCard"
import closeIcon from "../../../Icons/closeIcon"
import LoadableSelect from "../Select"
import Pagination from "../../Pagination"
import {useRecoilValue} from "recoil"
import {userAtom} from '@Components/Logic/UseTokenAndUserStorage'
import {useLoadableCache} from "@Components/Components/Inputs/Loadable"

const columns = [
  {
    id: "position",
    label: "ФИО, Должность",
    component: ({ParentValue = {}} = {}) => {
      return UserCard(ParentValue)
    },
    sizes: 250
  },
  {
    id: "department",
    label: "Отдел",
    component: ({ParentValue: {department}}) => <BaseCell value={department} className="flex items-center h-full"/>,
    sizes: 230
  },
  {
    id: "organizations",
    label: "Организация",
    component: ({ParentValue: {organization}}) => <BaseSubCell value={organization} subValue={organization}/>,
    sizes: 280
  },
  {
    id: "branch",
    label: "Филиал",
    component: ({ParentValue: {branch}}) => <BaseSubCell value={branch} subValue={branch}/>,
    sizes: 180
  },
]

const emptyWrapper = (({children}) => children)

const OrgStructureWindow = props => {
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
    id,
    valueKey,
    multiple,
    returnOption
  } = props
  const {
    setLimit,
    setPage,
    paginationState
  } = pagination

  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState(value)
  const {organization: [{branches, ...organizationOptions}]} = useRecoilValue(userAtom)

  const {valueKeys, cache} = useLoadableCache({
    ...props,
    optionsMap: useMemo(() => options.reduce((acc, item) => {
      acc[item[valueKey]] = item
      return acc
    }, {}), [valueKey, options]),
    value: selectState
  })


  useEffect(() => onSort({key: columns[0].id, direction: "ASC"}), [])

  const filterRef = useRef(filter)

  const disBranches = useMemo(() => filter.organization?.length < 2, [filter.organization])
  const disDepartment = useMemo(() => !filter.branchId || filter.branchId?.length < 2, [filter.branchId])

  useEffect(() => {
    if (!filter.branchId && filter.branchId?.length < 2 || filterRef.current.branchId !== filter.branchId) {
      const {departmentId, ...item} = {...filter}
      setFilter({...item})
    }
  }, [filter.branchId])

  useEffect(() => {
    if (filter.organization?.length < 2 || filterRef.current.organization !== filter.organization) {
      const {branchId, ...item} = {...filter}
      setFilter({...item})
    }
  }, [filter.organization])

  const fields = useMemo(() => [
    {
      id: "query",
      component: SearchInput,
      placeholder: "Поиск",
      children: <Icon icon={searchIcon} size={10} className="color-text-secondary mr-2.5"/>
    },
    {
      id: "departmentId",
      component: LoadableSelect,
      disabled: disDepartment,
      valueKey: "r_object_id",
      labelKey: "dss_name",
      placeholder: "Отдел",
      loadFunction: async () => {
        const {data} = await api.post(URL_ORGSTURCTURE_DEPARTMENTS, {branchIds: [filter.branchId]})
        return data
      }
    },
    {
      id: "organization",
      component: LoadableSelect,
      valueKey: "r_object_id",
      options: [organizationOptions],
      labelKey: "dss_name",
      placeholder: "Организация",
      loadFunction: async () => {
        const {data} = await api.post(URL_ORGSTURCTURE_ORGANIZATIONS)
        return data
      }
    },
    {
      id: "branchId",
      placeholder: "Филиал",
      component: LoadableSelect,
      disabled: disBranches,
      valueKey: "r_object_id",
      labelKey: "dss_name",
      options: branches,
      loadFunction: async () => {
        const {data} = await api.post(URL_ORGSTURCTURE_BRANCHES, {id: filter.organization})
        return data
      }
    }
  ], [api, filter, options])

  useEffect(() => loadFunction(), [loadFunction])

  const onRemoveSelectedValue = useCallback((id) => () => setSelectState((prevValue) => {
    if (multiple) {
      const nextValue = Array.isArray(prevValue) ? [...prevValue] : []
      const findIndexFunc = returnOption
        ? ({[valueKey]: objValueKey}) => objValueKey === id
        : (objValueKey) => objValueKey === id
      nextValue.splice(nextValue.findIndex(findIndexFunc, 1))
      return nextValue
    }
    return undefined
  }), [multiple, returnOption, valueKey])

  const renderEmployee = useMemo(() => valueKeys.map((value) => {
    const obj = cache.get(value)
    return (
      <div className="bg-form-input-color p-3 flex mb-2 min-" key={value}>
        <UserCard {...obj} widthDepartment={true}/>
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
  }), [valueKeys, cache, onRemoveSelectedValue])

  const handleClick = useCallback(() => {
    onInput(selectState, id)
    onClose()
  }, [onInput, onClose, selectState, id])

  const handleSelectClick = useCallback((obj) => () => setSelectState(returnOption ? obj : obj[valueKey]),
    [setSelectState, returnOption, valueKey])

  return <div className="flex flex-col overflow-hidden h-full">
    <div className="flex overflow-hidden  h-full">
      <SelectedEmployeeContainer>
        <ScrollBar className="pr-6 py-4">
          {renderEmployee}
        </ScrollBar>
      </SelectedEmployeeContainer>
      <div className="px-4 pb-4 overflow-hidden flex-container">
        <div className="flex items-center py-4">
          <FilterForm
            fields={fields}
            inputWrapper={emptyWrapper}
            value={filter}
            onInput={setFilter}
          >
          </FilterForm>
        </div>
        <ListTable
          rowComponent={useMemo(() => (props) => <RowComponent
            onClick={handleSelectClick} {...props}
          />, [handleSelectClick])}
          value={options}
          columns={columns}
          plugins={useMemo(() =>
              multiple
                ? {
                  outerSortPlugin: {component: SortCellComponent, downDirectionKey: "DESC"},
                  selectPlugin: {
                    driver: FlatSelect,
                    component: CheckBox,
                    style: {margin: "auto 0"},
                    valueKey,
                    returnObjects: returnOption
                  },
                }
                : {outerSortPlugin: {component: SortCellComponent, downDirectionKey: "DESC"}},
            [multiple, returnOption, valueKey])}
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
          >
          </Pagination>
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
}

const OrgStructureWindowWrapper = props => 
<OrgStructureWindowComponent {...props} title="Добавление сотрудника">
  <OrgStructureWindow {...props}/>
</OrgStructureWindowComponent>

export default OrgStructureWindowWrapper;