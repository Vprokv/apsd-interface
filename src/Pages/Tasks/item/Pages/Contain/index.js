import { useCallback, useContext, useMemo, useState } from 'react'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import {
  URL_ENTITY_LIST,
  URL_TITLE_CONTAIN,
  URL_TITLE_CONTAIN_DELETE,
} from '@/ApiList'
import { TASK_TYPE } from '@/Pages/Tasks/list/constants'
import { ApiContext, TASK_ITEM_STRUCTURE } from '@/contants'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Contain/styles'
import ListTable from '@Components/Components/Tables/ListTable'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ButtonForIcon, SecondaryBlueButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import XlsIcon from '@/Icons/XlsIcon'
import SortIcon from './Icons/SortIcon'
import { EmptyInputWrapper } from '@Components/Components/Forms/index'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { useParams } from 'react-router-dom'
import CreateTitleDepartment from './Components/CreateTitleDepartment'
import LeafTableComponent from './Components/LeafTableComponent'
import {
  LoadContainChildrenContext,
  ShowContentByTypeButtonContext,
} from '@/Pages/Tasks/item/Pages/Contain/constants'
import CreateVolume from './Components/CreateVolume'
import DeleteContain from '@/Pages/Tasks/item/Pages/Contain/Components/DeleteContain'
import DateCell from './Components/DateCell'
import ViewIcon from '@/Icons/ViewIcon'
import PreviewContentWindow from '@/Components/PreviewContentWindow'
import RowComponent from '@/Pages/Tasks/item/Pages/Contain/Components/RowComponent'
import { TabStateManipulation } from '@Components/Logic/Tab'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import TitleNameComponent from '@/Pages/Tasks/item/Pages/Contain/Components/TitleNameComponent'
import EditIcon from '@/Icons/editIcon'
import Tips from '@/Components/Tips'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Удаление выполнено успешно',
    }
  },
}

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
  treePlugin: {
    valueKey: 'id',
    nestedDataKey: 'childs',
    defaultOpen: false,
    component: LeafTableComponent,
  },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
    returnObjects: true,
  },
}

const columns = [
  {
    id: 'name',
    label: 'Наименование',
    className: 'flex font-size-12',
    component: TitleNameComponent,
    sizes: 500,
  },
  {
    id: 'linkName',
    label: 'Связь',
    className: 'flex font-size-12',
  },
  {
    id: 'author',
    label: 'Автор',
    className: 'flex font-size-12',
  },
  {
    id: 'regNumber',
    label: 'Шифр',
    className: 'flex font-size-12',
  },
  {
    id: 'status',
    label: 'Состояние раздела/тома',
    className: 'flex font-size-12',
    sizes: 190,
  },
  {
    id: 'result',
    label: 'Результат',
    className: 'flex font-size-12',
  },
  {
    id: 'stage',
    label: 'Стадия',
    className: 'flex font-size-12',
  },
  {
    id: 'Даты разраб.(план/факт)',
    label: 'Даты разраб.(план/факт)',
    sizes: 200,
    component: ({ ParentValue: { plannedDevDate, actualDevDate } }) => (
      <DateCell plan={plannedDevDate} real={actualDevDate} />
    ),
  },
  {
    id: 'Дата согл.(план/факт)',
    label: 'Дата сог.(план/факт)',
    sizes: 200,
    component: ({ ParentValue: { plannedApproveDate, actualApproveDate } }) => (
      <DateCell plan={plannedApproveDate} real={actualApproveDate} />
    ),
  },
  {
    id: 'delayDevelopmentDay',
    label: 'Просрочка разработки',
    className: 'flex font-size-12',
    sizes: 180,
  },
  {
    id: 'delayApprovalDay',
    label: 'Просрочка согласования',
    className: 'flex font-size-12',
    sizes: 180,
  },
]

const Contain = () => {
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const { id } = useParams()
  const [filterValue, setFilterValue] = useState({})
  const [sortQuery, onSort] = useState({})
  const [selectState, setSelectState] = useState([])
  const [addDepartmentState, setAddDepartmentState] = useState({})
  const [addVolumeState, setAddVolumeState] = useState({})
  const [renderPreviewWindow, setRenderPreviewWindowState] = useState(false)
  const [showContentByTypeButton, setShowContentByTypeButton] = useState()
  const getNotification = useOpenNotification()
  const [defaultOpen, setDefaultOpen] = useState(true)

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_STRUCTURE,
  })
  const {
    setTabState,
    tabState: { data },
  } = tabItemState

  const loadData = useCallback(
    async (partId = null) => {
      const { data } = await api.post(URL_TITLE_CONTAIN, {
        expand: true,
        titleId: id,
        partId,
      })
      return data
    },
    [api, id],
  )

  const deleteData = useCallback(async () => {
    try {
      const response = await Promise.all(
        selectState.map(({ id }) =>
          api.post(URL_TITLE_CONTAIN_DELETE, { partId: id }),
        ),
      )
      const removeDeletedDocs = (acc, { id, children, ...rest }) => {
        if (selectState.every((r) => r.id !== id)) {
          acc.push({
            id,
            ...rest,
            children: children
              ? children.reduce(removeDeletedDocs, [])
              : undefined,
          })
        }

        return acc
      }
      setTabState({
        data: data.reduce(removeDeletedDocs, []),
      })
      setSelectState([])
      getNotification(customMessagesFuncMap[response[0].status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, data, getNotification, selectState, setTabState])

  const addDepartment = useCallback(async () => {
    setAddDepartmentState({
      onCreate: async () => {
        const newData = await loadData()
        setTabState({
          data: newData.map((nD) => {
            const oldRow = data.find((r) => r.id === nD.id)

            return oldRow ? { ...oldRow, ...nD } : nD
          }),
        })
        setAddDepartmentState({})
      },
      onCancel: () => {
        setAddDepartmentState({})
      },
    })
  }, [data, loadData, setTabState])

  const containActions = useMemo(
    () => ({
      addDepartment: (id) =>
        new Promise((resolve, reject) => {
          setAddDepartmentState({
            onCreate: () => {
              resolve()
              setAddDepartmentState({})
            },
            onCancel: () => {
              reject()
              setAddDepartmentState({})
            },
            id,
          })
        }),
      addVolume: (row) =>
        new Promise((resolve, reject) => {
          setAddVolumeState({
            onCreate: () => {
              resolve()
              setAddVolumeState({})
            },
            onCancel: () => {
              reject()
              setAddVolumeState({})
            },
            row,
          })
        }),
      loadData,
    }),
    [loadData],
  )

  useAutoReload(loadData, tabItemState)

  const fields = useMemo(
    () => [
      {
        id: '1',
        component: LoadableSelect,
        placeholder: 'Нарушение срока',
        className: 'font-size-12',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
          return data
        },
      },
      {
        id: '2',
        component: UserSelect,
        placeholder: 'Исполнитель',
      },
    ],
    [api],
  )

  const onTableUpdate = useCallback(
    (data) => setTabState({ data }),
    [setTabState],
  )

  const disabled = useMemo(
    () => !selectState[0]?.did_tom && !selectState[0]?.content,
    [selectState],
  )

  const handleDoubleClick = useCallback(
    ({ tomId, type }) =>
      () =>
        tomId && openTabOrCreateNewTab(`/document/${tomId}/${type}`),
    [openTabOrCreateNewTab],
  )

  const onShowContentByTypeButton = useCallback(
    (id) => () => {
      setSelectState([])
      setShowContentByTypeButton(id)
      setRenderPreviewWindowState(true)
    },
    [],
  )

  const changeOpenState = useCallback(() => setDefaultOpen((prev) => !prev), [])

  return (
    <LoadContainChildrenContext.Provider value={containActions}>
      <div className="flex-container p-4 w-full overflow-hidden">
        <div className="flex items-center form-element-sizes-32 w-full mb-4">
          <FilterForm
            className="mr-2 "
            value={filterValue}
            onInput={setFilterValue}
            fields={fields}
            inputWrapper={EmptyInputWrapper}
          />
          <div className="flex items-center ml-auto">
            <CreateTitleDepartment
              className="mr-2 font-size-12"
              addDepartmentState={addDepartmentState}
              onAddDepartment={addDepartment}
            />
            <CreateVolume
              className="mr-2 font-size-12"
              addVolumeState={addVolumeState}
            />
            <SecondaryBlueButton className="mr-2 font-size-12" disabled>
              Связь
            </SecondaryBlueButton>
            <div className="flex items-center color-text-secondary">
              <Tips text="Посмотреть файл">
                <ButtonForIcon
                  className="mr-2"
                  onClick={useCallback(
                    () => setRenderPreviewWindowState(true),
                    [],
                  )}
                  disabled={disabled}
                >
                  <Icon size={20} icon={ViewIcon} />
                </ButtonForIcon>
              </Tips>
              <DeleteContain
                selectState={selectState}
                onDeleteData={deleteData}
              />
              <Tips text="Свернуть">
                <ButtonForIcon
                  className="mr-2"
                  onClick={changeOpenState}
                  disabled={disabled}
                >
                  <Icon icon={SortIcon} />
                </ButtonForIcon>
              </Tips>
              <Tips text="Выгрузить в Excel">
                <ButtonForIcon onClick={changeOpenState}>
                  <Icon icon={XlsIcon} />
                </ButtonForIcon>
              </Tips>
            </div>
          </div>
        </div>
        <ShowContentByTypeButtonContext.Provider
          value={onShowContentByTypeButton}
        >
          <ListTable
            rowComponent={useMemo(
              () => (props) =>
                <RowComponent onDoubleClick={handleDoubleClick} {...props} />,
              [handleDoubleClick],
            )}
            plugins={useMemo(() => {
              return {
                outerSortPlugin: { component: SortCellComponent },
                treePlugin: {
                  valueKey: 'id',
                  nestedDataKey: 'childs',
                  defaultOpen,
                  component: LeafTableComponent,
                },
                selectPlugin: {
                  driver: FlatSelect,
                  component: CheckBox,
                  style: { margin: 'auto 0' },
                  valueKey: 'id',
                  returnObjects: true,
                },
              }
            }, [defaultOpen])}
            headerCellComponent={HeaderCell}
            columns={columns}
            selectState={selectState}
            onSelect={setSelectState}
            sortQuery={sortQuery}
            onSort={onSort}
            value={data}
            onInput={onTableUpdate}
          />
        </ShowContentByTypeButtonContext.Provider>
        <PreviewContentWindow
          open={renderPreviewWindow}
          onClose={useCallback(() => setRenderPreviewWindowState(false), [])}
          id={selectState[0]?.content?.id || showContentByTypeButton}
          type="ddt_document_content"
        />
      </div>
    </LoadContainChildrenContext.Provider>
  )
}

export default Contain
