import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Icon from '@Components/Components/Icon'
import {
  ButtonForIcon,
  LoadableButtonForIcon,
  SecondaryBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'
import ListTable from '@Components/Components/Tables/ListTable'
import {
  URL_CONTENT_LIST,
  URL_CONTENT_PERMIT,
  URL_DELETE_VERSION,
  URL_DOWNLOAD_FILE,
} from '@/ApiList'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ApiContext, TASK_ITEM_CONTENT } from '@/contants'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import deleteIcon from '@/Icons/deleteIcon'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Form from '@Components/Components/Forms'
import AddVersionWindow from './Components/DownloadWindow'
import EmptyInputWrapper from '@Components/Components/Forms/EmptyInputWrapper'
import ViewIcon from '@/Icons/ViewIcon'
import EditVersionWindow from './Components/EditVersionWindow'
import Pagination from '../../../../../Components/Pagination'
import usePagination from '../../../../../components_ocean/Logic/usePagination'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import DownloadIcon from '@/Icons/DownloadIcon'
import downloadFile from '@/Utils/DownloadFile'
import { FormWindow } from '@/Components/ModalWindow'
import PreviewContentWindow from '@/Components/PreviewContentWindow/index'
import EditIcon from '@/Icons/editIcon'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import ShowLineRowComponent from '@/Components/ShowLineRowComponent'
import Tips from '@/Components/Tips'
import { ContentWindowWrapper } from '@/Components/PreviewContentWindow/Decorators'
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
    valueKey: 'id',
    returnObjects: true,
  },
  movePlugin: {
    id: TASK_ITEM_CONTENT,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const filterFormConfig = [
  {
    id: 'isFullVersion',
    component: CheckBox,
    className: 'font-size-14',
    text: 'Отобразить все версии',
  },
]

const columns = [
  {
    id: 'contentName',
    label: 'Описание',
    sizes: 190,
    component: (props) => <BaseCell {...props} className="break-all h-full" />,
  },
  {
    id: 'versionDate',
    label: 'Дата загрузки',
    component: BaseCell,
  },
  {
    id: 'regNumber',
    label: 'Шифр/Рег. номер',
    component: BaseCell,
  },
  {
    id: 'contentType',
    label: 'Тип файла',
    component: BaseCell,
  },
  {
    id: 'author',
    label: 'Автор',
    component: BaseCell,
  },
  {
    id: 'version',
    label: 'Версия',
    component: BaseCell,
  },
  {
    id: 'comment',
    label: 'Комментарий',
    component: BaseCell,
  },
]

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Контент добавлен успешно',
    }
  },
}

const DownloadContentWindow = ContentWindowWrapper(PreviewContentWindow)

const defaultSortQuery = {
  key: 'versionDate',
  direction: 'DESC',
}

const defaultFilter = { isFullVersion: false }

const Content = () => {
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [addSubscriptionWindow, setAddSubscriptionWindowState] = useState(false)
  const [openEditWindow, setOpenEditWindow] = useState(false)
  const [dataVersion, setDataVersion] = useState({})
  const [errorState, setErrorState] = useState()
  const [renderPreviewWindow, setRenderPreviewWindowState] = useState(false)
  const getNotification = useOpenNotification()

  const [
    {
      permit = false,
      sortQuery = defaultSortQuery,
      filter = defaultFilter,
      ...tabState
    },
    setTabState,
  ] = useTabItem({
    stateId: TASK_ITEM_CONTENT,
  })

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_ITEM_CONTENT,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const loadData = useCallback(async () => {
    try {
      const { limit, offset } = paginationState

      const { data } = await api.post(URL_CONTENT_LIST, {
        documentId: id,
        currentVersion: !filter.isFullVersion,
        limit,
        offset,
        sort: sortQuery.key
          ? [
              {
                property: sortQuery.key,
                direction: sortQuery.direction,
              },
            ]
          : [],
      })

      return data
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    paginationState,
    api,
    id,
    filter.isFullVersion,
    sortQuery.key,
    sortQuery.direction,
    getNotification,
  ])

  const [
    { loading, data: { content = [], total = 0 } = {}, reloadData },
    updateData,
  ] = useAutoReload(loadData, tabState, setTabState)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.post(URL_CONTENT_PERMIT, { documentId: id })
        setTabState({
          permit: data,
        })
      } catch (e) {
        setTabState({
          permit: false,
        })
      }
    })()
  }, [id, setTabState, api])

  const openSubscriptionWindow = useCallback(
    () => setAddSubscriptionWindowState(true),
    [],
  )
  const closeSubscriptionWindow = useCallback(
    () => setAddSubscriptionWindowState(false),
    [],
  )
  const deleteVersion = useCallback(async () => {
    if (selectState && selectState.length > 0) {
      try {
        const response = await Promise.all([
          selectState.map(({ id }) => {
            return api.post(URL_DELETE_VERSION, {
              id,
            })
          }),
        ])
        reloadData()
        getNotification(customMessagesFuncMap[response[0].status]())
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(customMessagesFuncMap[status](data))
      }
    }
  }, [api, getNotification, reloadData, selectState])

  const closeEditWindow = useCallback(() => setOpenEditWindow(false), [])

  const editVersion = useCallback(async () => {
    setDataVersion(selectState[0])
    setOpenEditWindow(true)
  }, [selectState])

  const idContent = useMemo(() => {
    if (content?.length) {
      return content.find((item) => item.version === 'Основная')?.contentId
    }
  }, [content])

  const downLoadContent = useCallback(async () => {
    let errorString = ''

    const res = await Promise.all(
      selectState.map(
        ({ id }) =>
          new Promise((res) => {
            api
              .post(
                URL_DOWNLOAD_FILE,
                {
                  type: 'ddt_apsd_content_version',
                  column: 'dsc_content',
                  id,
                },
                { responseType: 'blob' },
              )
              .then((response) => {
                res(response)
              })
              .catch(() => res(new Error('Документ не найден')))
          }),
      ),
    )

    res.forEach((val, i) => {
      if (val instanceof Error) {
        errorString = `${errorString}, Документ ${selectState[i]?.contentName} не найден`
      } else {
        downloadFile(val)
      }
    })

    if (errorString.length) {
      setErrorState(errorString.trim())
    }
  }, [api, selectState])

  const disabled = useMemo(() => !selectState.length > 0, [selectState])

  const onDoubleClick = useCallback(
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

  return (
    <div className="flex-container p-4 w-full overflow-hidden">
      <div className="flex items-center form-element-sizes-32 mb-4">
        <Form
          fields={filterFormConfig}
          inputWrapper={EmptyInputWrapper}
          value={filter}
          onInput={useCallback(
            (filter) => setTabState({ filter }),
            [setTabState],
          )}
        />
        <div className="ml-auto flex items-center color-text-secondary">
          <SecondaryBlueButton
            disabled={!permit}
            className="ml-2 text-white flex items-center w-60 rounded-lg justify-center"
            onClick={openSubscriptionWindow}
          >
            Добавить файл /версию
          </SecondaryBlueButton>
          <Tips text="Скачать контент">
            <LoadableButtonForIcon
              onClick={downLoadContent}
              disabled={disabled}
              className="ml-2"
            >
              <Icon icon={DownloadIcon} />
            </LoadableButtonForIcon>
          </Tips>
          <Tips text="Редактировать">
            <ButtonForIcon
              onClick={editVersion}
              disabled={disabled}
              className="ml-2"
            >
              <Icon icon={EditIcon} />
            </ButtonForIcon>
          </Tips>
          <Tips text="Посмотреть файл">
            <ButtonForIcon
              onClick={useCallback(() => setRenderPreviewWindowState(true), [])}
              disabled={!selectState[0]}
              className="ml-2"
            >
              <Icon size={20} icon={ViewIcon} />
            </ButtonForIcon>
          </Tips>
          <Tips text="Удалить">
            <ButtonForIcon
              onClick={deleteVersion}
              disabled={!selectState[0]}
              className="ml-2"
            >
              <Icon size={20} icon={deleteIcon} />
            </ButtonForIcon>
          </Tips>
          <ColumnController columns={columns} id={TASK_ITEM_CONTENT} />
        </div>
      </div>
      <FormWindow open={errorState} onClose={() => setErrorState('')}>
        <div className="text-center mt-4 mb-12">{errorState}</div>
        <SecondaryGreyButton
          type="button"
          className="w-40 m-auto"
          onClick={() => setErrorState('')}
        >
          Закрыть
        </SecondaryGreyButton>
      </FormWindow>
      <ListTable
        rowComponent={useMemo(
          () => (props) =>
            <ShowLineRowComponent {...props} onDoubleClick={onDoubleClick} />,
          [onDoubleClick],
        )}
        value={content || []}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        onInput={updateData}
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
        total={total}
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${total}`}
      </Pagination>
      <AddVersionWindow
        contentId={idContent}
        open={addSubscriptionWindow}
        onClose={closeSubscriptionWindow}
      />
      <EditVersionWindow
        formData={dataVersion}
        open={openEditWindow}
        onClose={closeEditWindow}
      />
      <DownloadContentWindow
        open={renderPreviewWindow}
        onClose={closeWindow}
        value={selectState}
      />
    </div>
  )
}

export default Content
