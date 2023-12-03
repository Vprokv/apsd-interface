import { useCallback, useContext, useMemo, useState } from 'react'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import {
  URL_ENTITY_LIST,
  URL_EXPORT,
  URL_EXPORT_FILE,
  URL_STORAGE_DOCUMENT,
  URL_TITLE_CONTAIN,
  URL_TITLE_CONTAIN_DELETE,
} from '@/ApiList'
import { TASK_TYPE } from '@/Pages/Tasks/list/constants'
import {
  ApiContext,
  ITEM_DOCUMENT,
  TASK_ITEM_STRUCTURE,
  TokenContext,
} from '@/contants'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Contain/styles'
import ListTable from '@Components/Components/Tables/ListTable'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { DeepSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ButtonForIcon, LoadableButtonForIcon } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import XlsIcon from '@/Icons/XlsIcon'
import SortIcon from './Icons/SortIcon'
import { EmptyInputWrapper } from '@Components/Components/Forms/index'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { useParams } from 'react-router-dom'
import CreateTitleDepartment from './Components/CreateTitleDepartment'
import LeafTableComponent from './Components/LeafTableComponent'
import {
  columnMap,
  LoadContainChildrenContext,
  ShowContentByTypeButtonContext,
} from '@/Pages/Tasks/item/Pages/Contain/constants'
import CreateVolume from './Components/CreateVolume'
import DeleteContain from '@/Pages/Tasks/item/Pages/Contain/Components/DeleteContain'
import DateCell from './Components/DateCell'
import ViewIcon from '@/Icons/ViewIcon'
import PreviewContentWindow from '@/Components/PreviewContentWindow/index'
import RowComponent from '@/Pages/Tasks/item/Pages/Contain/Components/RowComponent'
import { TabStateManipulation } from '@Components/Logic/Tab'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import TitleNameComponent from '@/Pages/Tasks/item/Pages/Contain/Components/TitleNameComponent'
import Tips from '@/Components/Tips'
import CreateLink from '@/Pages/Tasks/item/Pages/Contain/Components/CreateLink'
import { ContainWindowWrapper } from '@/Components/PreviewContentWindow/Decorators'
import EditLink from '@/Pages/Tasks/item/Pages/Contain/Components/EditWindow'
import ReloadIcon from '@/Icons/ReloadIcon'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import { useRecoilState } from 'recoil'
import { cachedLocalStorageValue } from '@Components/Logic/Storages/localStorageCache'
import { API_URL } from '@/api'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'
import ResultCell from '@/Pages/Tasks/item/Pages/Contain/Components/ResultCell'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Удаление выполнено успешно',
    }
  },
}

const columns = [
  {
    id: 'name',
    label: 'Наименование',
    className: 'flex font-size-12',
    component: TitleNameComponent,
    sizes: 600,
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
    component: ResultCell,
    className: 'flex font-size-12',
  },
  {
    id: 'tomStage',
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
    label: 'Просрочка проектировщика',
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

const ContentWindow = ContainWindowWrapper(PreviewContentWindow)

const Contain = () => {
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const { id } = useParams()
  const [filterValue, setFilterValue] = useState({})
  const [sortQuery, onSort] = useState({})
  const [selectState, setSelectState] = useState([])
  const [addDepartmentState, setAddDepartmentState] = useState({})
  const [addVolumeState, setAddVolumeState] = useState({})
  const [addLinkState, setAddLinkState] = useState({})
  const [addEditLinkState, setEditLinkState] = useState({})
  const [renderPreviewWindow, setRenderPreviewWindowState] = useState(false)
  const getNotification = useOpenNotification()
  const { token } = useContext(TokenContext)

  const {
    tabState: { data: { values: { dss_code = '' } = {} } = {} },
  } = useTabItem({
    stateId: ITEM_DOCUMENT,
  })

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_STRUCTURE,
  })
  const {
    setTabState,
    tabState: { data, loading, defaultOpen, treePluginState },
  } = tabItemState

  const loadData = useCallback(
    ({ source = {}, controller = {} } = {}) =>
      async (partId = null, expand = true) => {
        try {
          const { data } = await api.post(
            URL_TITLE_CONTAIN,
            {
              expand,
              titleId: id,
              partId,
            },
            {
              cancelToken: source.token,
              signal: controller.signal,
            },
          )
          return data
        } catch (e) {
          const { response: { status, data } = {} } = e
          getNotification(customMessagesFuncMap[status](data))
        }
      },
    [api, getNotification, id],
  )

  const deleteData = useCallback(async () => {
    try {
      const response = await Promise.all(
        selectState.map(({ id }) =>
          api.post(URL_TITLE_CONTAIN_DELETE, { partId: id }),
        ),
      )
      const removeDeletedDocs = (acc, { id, childs, ...rest }) => {
        if (selectState.every((r) => r.id !== id)) {
          acc.push({
            id,
            ...rest,
            childs: childs ? childs.reduce(removeDeletedDocs, []) : undefined,
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
        // TODO: сделать нормальный bypass контроллера и параметров. Вызов без параметров.  Вызов без контроллером
        const newData = await loadData()()
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
      addLink: (id) =>
        new Promise((resolve, reject) => {
          setAddLinkState({
            onCreate: () => {
              resolve()
              setAddLinkState({})
            },
            onCancel: () => {
              reject()
              setAddLinkState({})
            },
            id,
          })
        }),
      editLink: (document) =>
        new Promise((resolve, reject) => {
          setEditLinkState({
            onCreate: () => {
              resolve()
              setEditLinkState({})
            },
            onCancel: () => {
              reject()
              setEditLinkState({})
            },
            document,
          })
        }),
      // TODO: сделать нормальный bypass контроллера и параметров. Вызов без контроллера. Но с параметрами
      loadData: loadData(),
      selectState,
    }),
    [loadData, selectState],
  )

  useAutoReload(
    // TODO: сделать нормальный bypass контроллера и параметров. Вызов без параметров. Но с контроллером
    useCallback((controller) => loadData(controller)(), [loadData]),
    tabItemState,
  )

  const updateTreePluginState = useCallback(
    (treePluginState) => setTabState({ treePluginState }),
    [setTabState],
  )

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
    (value) => () => {
      setSelectState((prevValue) => {
        const prev = [...prevValue]
        prev.splice(0, 0, value)
        return prev
      })
      setRenderPreviewWindowState(true)
    },
    [],
  )

  const closeWindow = useCallback(() => {
    setSelectState((prev) => {
      const prevState = [...prev]
      prevState.splice(0, 1)
      return prevState
    })
    setRenderPreviewWindowState(false)
  }, [])

  const changeOpenState = useCallback(() => {
    setTabState({ treePluginState: {} })

    setTabState(({ defaultOpen = false }) => {
      return { defaultOpen: !defaultOpen }
    })
  }, [setTabState])

  const onReload = useCallback(() => {
    setTabState({ loading: false, fetched: false })
  }, [setTabState])

  const onExportToExcel = useCallback(async () => {
    const {
      data: { id: dataId },
    } = await api.post(URL_EXPORT, {
      url: `${API_URL}/${URL_TITLE_CONTAIN}`,
      label: `Состав титула "${dss_code}"`,
      sheetName: `Состав титула "${dss_code}"`,
      columns: columnMap,
      body: {
        expand: true,
        titleId: id,
        partId: null,
        token,
      },
    })

    const { data } = await api.get(`${URL_EXPORT_FILE}${dataId}:${token}`, {
      responseType: 'blob',
    })

    downloadFileWithReload(data, `Состав титула ${dss_code}.xlsx`)
  }, [api, dss_code, id, token])

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
            <CreateLink addLinkState={addLinkState} />
            <EditLink addEditLinkState={addEditLinkState} />
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
                <ButtonForIcon className="mr-2" onClick={changeOpenState}>
                  <Icon icon={SortIcon} />
                </ButtonForIcon>
              </Tips>
              <Tips text="Выгрузить в Excel">
                <LoadableButtonForIcon
                  className="color-green"
                  onClick={onExportToExcel}
                >
                  <Icon icon={XlsIcon} />
                </LoadableButtonForIcon>
              </Tips>
              <Tips text="Обновить">
                <LoadableButtonForIcon className="ml-2" onClick={onReload}>
                  <Icon icon={ReloadIcon} />
                </LoadableButtonForIcon>
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
                  driver: DeepSelect,
                  component: CheckBox,
                  style: { margin: 'auto 0' },
                  valueKey: 'id',
                  returnObjects: true,
                  nestedDataKey: 'childs',
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
            loading={loading}
            treePluginState={treePluginState}
            updateTreePluginState={updateTreePluginState}
            // onTableInput
          />
        </ShowContentByTypeButtonContext.Provider>
        <ContentWindow
          open={renderPreviewWindow}
          onClose={closeWindow}
          value={selectState}
        />
      </div>
    </LoadContainChildrenContext.Provider>
  )
}

export default Contain
