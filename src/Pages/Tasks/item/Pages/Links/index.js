import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiContext, TASK_ITEM_LINK } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  URL_DOWNLOAD_FILE,
  URL_ENTITY_LIST,
  URL_LINK_DELETE,
  URL_LINK_LIST,
  URL_LINK_USER_LIST,
  URL_SUBSCRIPTION_EVENTS,
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
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
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
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'linkId',
    returnObjects: true,
  },
}

const columns = [
  {
    id: 'documentTypeLabel',
    label: 'Документ',
    className: 'h-10 flex items-center',
    component: (props) => (
      <BaseCell
        className="flex items-center break-words break-all"
        {...props}
      />
    ),
    sizes: 200,
  },
  {
    id: 'description',
    label: 'Краткое содержание',
    component: (props) => (
      <BaseCell
        className="flex items-center break-words break-all"
        {...props}
      />
    ),
    sizes: 250,
  },
  {
    id: 'authorFullName',
    label: 'Автор',
    component: BaseCell,
    sizes: 100,
  },
  {
    id: 'stageName',
    label: 'Этап',
    component: BaseCell,
    sizes: 140,
  },
  {
    id: 'comment',
    label: 'Комментарий',
    component: (props) => (
      <BaseCell
        className="flex items-center break-words break-all"
        {...props}
      />
    ),
    sizes: 120,
  },
  {
    id: 'linkDate',
    label: 'Дата связи',
    component: BaseCell,
    sizes: 100,
  },
  {
    id: 'linkType',
    label: 'Тип связи',
    component: BaseCell,
    sizes: 220,
  },
]

const AddUserOptionsFullName = (v = {}) => ({
  ...v,
  fullName: `${v.fio} 111`,
  fullDescription: `${v.fio}, ${v.positionName}, ${v.departmentName}222`,
  position: v.positionName,
  department: v.departmentName,
  r_object_id: '1212',
})

const ContentWindow = LinkWindowWrapper(PreviewContentWindow)

const Links = () => {
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [filter, setFilterValue] = useState({})
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({
    key: 'linkDate',
    direction: 'DESC',
  })
  const [errorState, setErrorState] = useState()
  const [renderPreviewWindow, setRenderPreviewWindowState] = useState(false)

  const getNotification = useOpenNotification()

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_LINK,
  })
  const {
    tabState,
    setTabState,
    tabState: { data: { content = [], total = 0 } = {}, loading },
  } = tabItemState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: URL_SUBSCRIPTION_EVENTS,
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

  useAutoReload(loadData, tabItemState)

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
        loadFunction: async (search) => {
          const {
            data: { userModelList },
          } = await api.post(URL_LINK_USER_LIST, {
            parentId: id,
            // sort: [
            //   {
            //     property: sortQuery.key,
            //     direction: sortQuery.direction,
            //   },
            // ],
            filter: { search },
          })
          return userModelList.map(AddUserOptionsFullName)
        },
        placeholder: 'Автор связи',
        valueKey: 'r_object_id',
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
      setTabState({ loading: false, fetched: false })
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, getNotification, selectState, setTabState])

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
    <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
      <div className="flex items-center py-4 form-element-sizes-32">
        <FilterForm
          className="mr-2"
          value={filter}
          onInput={setFilterValue}
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
              disabled={disabled}
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
        onSort={onSort}
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
