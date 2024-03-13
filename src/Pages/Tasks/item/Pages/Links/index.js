import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiContext, TASK_ITEM_LINK } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  URL_DOWNLOAD_FILE,
  URL_ENTITY_LIST,
  URL_LINK_DELETE,
  URL_LINK_LIST,
  URL_LINK_USER_LIST,
} from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import LoadableSelect from '@/Components/Inputs/Select'
import { FilterForm } from './styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { ButtonForIcon, SecondaryGreyButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import DeleteIcon from '@/Icons/deleteIcon'
import ListTable from '@Components/Components/Tables/ListTable'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import LinksWindow from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow'
import EditLinksWindow from '@/Pages/Tasks/item/Pages/Links/Components/EditLinksWindow'
import DownloadIcon from '@/Icons/DownloadIcon'
import downloadFile from '@/Utils/DownloadFile'
import { FormWindow } from '@/Components/ModalWindow'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import ViewIcon from '@/Icons/ViewIcon'
import PreviewContentWindow from '@/Components/PreviewContentWindow/index'
import Pagination from '@/Components/Pagination'
import usePagination from '@Components/Logic/usePagination'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import Tips from '@/Components/Tips'
import { LinkWindowWrapper } from '@/Components/PreviewContentWindow/Decorators'
import LinkOrgStructureComponent from '@/Pages/Tasks/item/Pages/Links/Components/LinkOrstructureComponent'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ColumnController from '@/Components/ListTableComponents/ColumnController'
import ShareIcon from '@/Icons/ShareIcon'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useNavigate } from 'react-router-dom'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Связь удалена успешно',
    }
  },
}

const plugins = {
  outerSortPlugin: {
    component: ModifiedSortCellComponent,
    downDirectionKey: 'DESC',
  },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'linkId',
    returnObjects: true,
  },
  movePlugin: {
    id: TASK_ITEM_LINK,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const columns = [
  {
    id: 'description',
    label: 'Краткое содержание',
    className: 'min-h-4',
    component: BaseCell,
    sizes: 250,
  },
  {
    id: 'authorFullName',
    label: 'Автор',
    className: 'min-h-4',
    component: BaseCell,
    sizes: 100,
  },
  {
    id: 'linkDate',
    label: 'Дата связи',
    className: 'min-h-4',
    component: BaseCell,
    sizes: 130,
  },
  {
    id: 'stageName',
    label: 'Этап',
    className: 'min-h-4',
    component: BaseCell,
    sizes: 140,
  },
  {
    id: 'documentTypeLabel',
    label: 'Тип документа',
    className: 'min-h-4',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'regNumber',
    label: 'Шифр/ Рег.номер',
    className: 'min-h-4',
    component: BaseCell,
    sizes: 130,
  },
  {
    id: 'regDate',
    label: 'Дата регистрации',
    className: 'min-h-4',
    component: BaseCell,
    sizes: 130,
  },
  {
    id: 'linkType',
    label: 'Тип связи',
    className: 'min-h-4',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'comment',
    label: 'Комментарий',
    className: 'min-h-4',
    component: BaseCell,
    sizes: 250,
  },
  {
    id: 'fileSize',
    label: 'Размер файла',
    className: 'min-h-4',
    component: BaseCell,
    sizes: 60,
  },
]

const AddUserOptionsFullName = (v = {}) => ({
  ...v,
  fullName: v.fio,
  fullDescription: `${v.fio}, ${v.positionName}, ${v.departmentName}`,
  position: v.positionName,
  department: v.departmentName,
  emplId: v.id,
})

const ContentWindow = LinkWindowWrapper(PreviewContentWindow)

const defaultSortQuery = {
  key: 'linkDate',
  direction: 'DESC',
}

const Links = () => {
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [errorState, setErrorState] = useState()
  const [renderPreviewWindow, setRenderPreviewWindowState] = useState(false)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const navigate = useNavigate()

  const getNotification = useOpenNotification()

  const [{ sortQuery = defaultSortQuery, filter, ...tabState }, setTabState] =
    useTabItem({
      stateId: TASK_ITEM_LINK,
    })

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_ITEM_LINK,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const loadData = useCallback(async () => {
    try {
      const { limit, offset } = paginationState
      const { data } = await api.post(URL_LINK_LIST, {
        parentId: id,
        sort: [
          {
            property: sortQuery.key,
            direction: sortQuery.direction,
          },
        ],
        filter,
        limit,
        offset,
      })

      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [paginationState, api, id, filter, getNotification, sortQuery])

  const [
    {
      data: { content = [], total = 0 } = {},
      loading,
      reloadData,
      shouldReloadData,
    },
  ] = useAutoReload(loadData, tabState, setTabState)

  useEffect(() => {
    if (!shouldReloadData) {
      reloadData()
    }
  }, [])

  const downLoadContent = useCallback(async () => {
    let errorString = ''

    const res = await Promise.all(
      selectState.reduce((acc, { contentId }) => {
        contentId &&
          acc.push(
            new Promise((res) => {
              api
                .post(
                  URL_DOWNLOAD_FILE,
                  {
                    type: 'ddt_document_content',
                    column: 'dsc_content',
                    id: contentId,
                  },
                  { responseType: 'blob' },
                )
                .then((response) => {
                  res(response)
                })
                .catch(() => res(new Error('Документ не найден')))
            }),
          )
        return acc
      }, []),
    )
    res.forEach((val) => {
      if (val.data instanceof Error) {
        errorString = `${errorString}, Документ не найден`
      } else {
        downloadFile(val)
      }
    })

    if (errorString.length) {
      setErrorState(errorString.trim())
    }
  }, [api, selectState])

  const disabled = useMemo(() => !selectState.length > 0, [selectState])

  const fields = useMemo(
    () => [
      {
        id: 'authorName',
        component: LinkOrgStructureComponent,
        loadFunction: async (query) => {
          const {
            data: { userModelList },
          } = await api.post(URL_LINK_USER_LIST, {
            parentId: id,
            filter: { query },
          })
          return userModelList.map(AddUserOptionsFullName)
        },
        placeholder: 'Автор связи',
        returnOption: false,
        valueKey: 'emplId',
        labelKey: 'fullName',
      },
      {
        id: 'linkType',
        component: LoadableSelect,
        placeholder: 'Тип связи',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_link_type',
            query,
          })
          return data
        },
      },
    ],
    [api, id],
  )

  const onDelete = useCallback(async () => {
    try {
      const response = await api.post(URL_LINK_DELETE, {
        linkIds: selectState.map(({ linkId }) => linkId),
      })
      reloadData()
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, getNotification, reloadData, selectState])

  const onDoubleClick = useCallback(
    (value) => () => {
      value?.childId && value?.childType
        ? openTabOrCreateNewTab(
            navigate(`/document/${value?.childId}/${value?.childType}`),
          )
        : setSelectState((prevValue) => {
            const prev = [...prevValue]
            prev.splice(0, 0, value)
            return prev
          })
      setRenderPreviewWindowState(true)
    },
    [navigate, openTabOrCreateNewTab],
  )

  const closeWindow = useCallback(() => {
    setSelectState((prev) => {
      const prevState = [...prev]
      prevState.splice(0, 1)
      return prevState
    })
    setRenderPreviewWindowState(false)
  }, [])

  const onShareLink = useCallback(
    () => window.open(selectState[0]?.externalLink, '_blank'),
    [selectState],
  )

  return (
    <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
      <div className="flex items-center py-4 form-element-sizes-32">
        <FilterForm
          className="mr-2"
          value={filter}
          onInput={useCallback(
            (filter) => setTabState({ filter }),
            [setTabState],
          )}
          fields={fields}
          inputWrapper={EmptyInputWrapper}
        />
        <div className="flex items-center ml-auto">
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
          <LinksWindow />
          <Tips text="Перейти по ссылке">
            <ButtonForIcon
              onClick={onShareLink}
              disabled={!selectState[0]?.externalLink}
              className="mr-2 color-text-secondary"
            >
              <Icon icon={ShareIcon} />
            </ButtonForIcon>
          </Tips>
          <Tips text="Скачать файл">
            <ButtonForIcon
              onClick={downLoadContent}
              disabled={disabled}
              className="mr-2 color-text-secondary"
            >
              <Icon icon={DownloadIcon} />
            </ButtonForIcon>
          </Tips>
          <Tips text="Посмотреть файл">
            <ButtonForIcon
              onClick={useCallback(() => setRenderPreviewWindowState(true), [])}
              disabled={!selectState[0]}
              className="mr-2 color-text-secondary"
            >
              <Icon size={20} icon={ViewIcon} />
            </ButtonForIcon>
          </Tips>
          <EditLinksWindow value={selectState} />
          <Tips text="Удалить файл">
            <ButtonForIcon
              onClick={onDelete}
              disabled={!selectState.length}
              className="color-text-secondary"
            >
              <Icon size={20} icon={DeleteIcon} />
            </ButtonForIcon>
          </Tips>
          <ColumnController columns={columns} id={TASK_ITEM_LINK} />
        </div>
      </div>
      <ListTable
        rowComponent={useMemo(
          () => (props) =>
            <RowComponent onDoubleClick={onDoubleClick} {...props} />,
          [onDoubleClick],
        )}
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
        valueKey="id"
        loading={loading}
      />
      <Pagination
        total={total}
        className="mt-2"
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${total}`}
      </Pagination>
      <ContentWindow
        open={renderPreviewWindow}
        onClose={closeWindow}
        value={selectState}
      />
    </div>
  )
}

Links.propTypes = {}

export default Links
