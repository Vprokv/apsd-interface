import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
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
import RowComponent from '@/Components/ListTableComponents/EmitValueRowComponent'
import ShowTemplate from '@/Components/Inputs/OrgStructure/OrgstructureComponentWithTemplate/Components/TemplateTab/ShowTemplate'
import { TemplateContext } from '@/Components/Inputs/OrgStructure/OrgstructureComponentWithTemplate/constans'
import ShowTemplateButtonComponent from '@/Components/Inputs/OrgStructure/OrgstructureComponentWithTemplate/Components/TemplateTab/ShowTemplate/ShowTemplateButtonComponent'
import Button from '@/Components/Button'
import ScrollBar from '@Components/Components/ScrollBar'
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
    valueKey: 'dsid_template',
    returnObjects: true,
  },
  movePlugin: {
    id: SETTINGS_TEMPLATES,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 200px 200px 200px 200px 150px;
  grid-column-gap: 0.5rem;
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
        className="flex items-center h-10"
      />
    ),
    sizes: baseCellSize,
  },
  {
    id: 'view',
    label: '',
    component: ShowTemplateButtonComponent,
  },
]

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

const baseSortState = {
  key: 'creationDate',
  direction: 'DESC',
}
const SearchTemplateWindowList = ({
  onClose,
  onInput,
  id,
  valueKey,
  // modalWindowOptions,
  setModalWindowOptions,
  selectState,
  setSelectState,
  returnObjects,
}) => {
  const api = useContext(ApiContext)
  const [{ filter, sortQuery = baseSortState, ...tabState }, setTabState] =
    useTabItem({ stateId: SETTINGS_TEMPLATES })
  const [selectTemplateState, setSelectTemplateState] = useState([])
  const [showTemplateWindowState, setShowTemplateWindowState] = useState(false)
  const [showTemplate, setShowTemplate] = useState({})
  const getNotification = useOpenNotification()

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: SETTINGS_TEMPLATES,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const [{ data: content, total = 0, loading }] = useAutoReload(
    useCallback(async () => {
      try {
        const { data } = await api.post(URL_TEMPLATE_LIST, {
          ...filter,
          type: 'ddt_employee_template',
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
    }, [api, filter, getNotification]),
    tabState,
    setTabState,
  )

  const onSelectRow = useCallback(
    (val) => () => {
      const { dsid_template: valKey, dss_json } = val
      const includesValue = selectTemplateState.find(({ dsid_template }) => {
        return dsid_template === valKey
      })

      const checkIncludesFunc = ({ acc, obj }) =>
        acc?.find(
          ({ [valueKey]: searchValue }) => searchValue === obj[valueKey],
        )

      const addNewValue = (json) => {
        setModalWindowOptions((modalVal) => {
          return json.reduce(
            (acc, obj) => {
              if (!checkIncludesFunc({ acc, obj })) {
                acc.splice(0, 0, obj)
              }
              return acc
            },
            [...modalVal],
          )
        })

        setSelectState((selectVal) => {
          const initVal = selectVal ? [...selectVal] : []
          const valueFunc = (addObj) =>
            returnObjects ? addObj : addObj[valueKey]

          return json.reduce((acc, obj) => {
            if (!checkIncludesFunc({ acc, obj })) {
              acc.splice(0, 0, valueFunc(obj))
            }
            return acc
          }, initVal)
        })

        setSelectTemplateState((prev) => {
          const nextValue = prev.length ? [...prev] : []
          nextValue.splice(0, 0, val)
          return nextValue
        })
      }

      const deleteFilterValue = (json) => {
        setModalWindowOptions((val) => {
          return json.reduce(
            (acc, obj) => {
              if (checkIncludesFunc({ acc, obj })) {
                acc.splice(
                  acc.findIndex(({ [valueKey]: key }) => key === obj[valueKey]),
                  1,
                )
              }
              return acc
            },
            [...val],
          )
        })

        setSelectState((val) => {
          const parseFunc = returnObjects
            ? (val) => val[valueKey]
            : (val) => val
          return json.reduce(
            (acc, obj) => {
              if (checkIncludesFunc({ acc, obj })) {
                acc.splice(
                  acc.findIndex((val) => parseFunc(val) === obj[valueKey]),
                  1,
                )
              }
              return acc
            },
            [...val],
          )
        })

        setSelectTemplateState((prev) => {
          const prevVal = [...prev]

          prevVal.splice(
            prevVal.findIndex(({ [valueKey]: key }) => key === val[valueKey]),
            1,
          )
          return prevVal
        })
      }

      return includesValue
        ? deleteFilterValue(JSON.parse(dss_json))
        : addNewValue(JSON.parse(dss_json))
    },
    [
      returnObjects,
      selectTemplateState,
      setModalWindowOptions,
      setSelectState,
      valueKey,
    ],
  )

  const handleClick = useCallback(() => {
    onInput(selectState, id)
    onClose()
  }, [onInput, selectState, id, onClose])

  const onShowComponent = useCallback(
    (val) => () => {
      setShowTemplate(val)
      setShowTemplateWindowState(true)
    },
    [],
  )

  return (
    <TemplateContext.Provider value={onShowComponent}>
      <div className=" p-4 overflow-hidden">
        <div className="flex flex-container h-full overflow-hidden">
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
            <div>
              <ColumnController columns={columns} id={SETTINGS_TEMPLATES} />
            </div>
          </div>
          <ScrollBar>
            <ListTable
              className="mt-2  h-full"
              rowComponent={useMemo(
                () => (props) =>
                  <RowComponent onClick={onSelectRow} {...props} />,
                [onSelectRow],
              )}
              value={content}
              columns={columns}
              plugins={plugins}
              headerCellComponent={HeaderCell}
              selectState={selectTemplateState}
              onSelect={onSelectRow}
              sortQuery={sortQuery}
              onSort={useCallback(
                (sortQuery) => setTabState({ sortQuery }),
                [setTabState],
              )}
              loading={loading}
            />
          </ScrollBar>

          <div className="flex items-center">
            <Pagination
              className="mt-2 w-full "
              limit={paginationState.limit}
              page={paginationState.page}
              setLimit={setLimit}
              setPage={setPage}
            />
            <div className="flex items-center justify-end mt-auto mt-auto">
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
        <ShowTemplate
          open={showTemplateWindowState}
          onClose={() => setShowTemplateWindowState(false)}
          showTemplate={showTemplate}
        />
      </div>
    </TemplateContext.Provider>
  )
}

SearchTemplateWindowList.propTypes = {}

export default SearchTemplateWindowList
