import { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext, TASK_ITEM_LINK } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  URL_DOWNLOAD_FILE,
  URL_ENTITY_LIST,
  URL_LINK_DELETE,
  URL_LINK_LIST,
  URL_SUBSCRIPTION_EVENTS,
} from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
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
import PreviewContentWindow from '@/Components/PreviewContentWindow'
import Pagination from '@/Components/Pagination'
import usePagination from '@Components/Logic/usePagination'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import Tips from '@/Components/Tips'

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
  outerSortPlugin: { component: SortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'contentId',
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
    sizes: 150,
  },
  {
    id: 'stageName',
    label: 'Этап',
    component: BaseCell,
    sizes: 200,
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
    sizes: 220,
  },
  {
    id: 'linkDate',
    label: 'Дата связи',
    component: BaseCell,
    sizes: 220,
  },
  {
    id: 'linkType',
    label: 'Тип связи',
    component: BaseCell,
    sizes: 220,
  },
]

const Links = () => {
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [filter, setFilterValue] = useState({})
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({})
  const [errorState, setErrorState] = useState()
  const [renderPreviewWindow, setRenderPreviewWindowState] = useState(false)
  const getNotification = useOpenNotification()

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_LINK,
  })
  const {
    tabState,
    setTabState,
    tabState: { data: { content = [], total = 0 } = {} },
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
        filter,
        limit,
        offset,
      })

      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [paginationState, api, id, filter, getNotification])

  useAutoReload(loadData, tabItemState)

  const downLoadContent = useCallback(async () => {
    let errorString = ''

    const res = await Promise.all(
      selectState.reduce((acc, { contentId }) => {
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
        id: 'documentType',
        component: LoadableSelect,
        placeholder: 'Тип документа',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        // loadFunction: async () => {
        //   const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
        //   return data
        // },
      },
      {
        id: 'authorName',
        component: UserSelect,
        placeholder: 'Автор связи',
        valueKey: 'userName',
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
    [api],
  )

  const onDelete = useCallback(async () => {
    try {
      const response = await api.post(URL_LINK_DELETE, { linkIds: selectState })
      setTabState({ loading: false, fetched: false })
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, getNotification, selectState, setTabState])

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
            <RowComponent onDoubleClick={() => null} {...props} />,
          [],
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
      <PreviewContentWindow
        open={renderPreviewWindow}
        onClose={useCallback(() => setRenderPreviewWindowState(false), [])}
        id={selectState[0]?.contentId}
        type="ddt_document_content"
      />
    </div>
  )
}

Links.propTypes = {}

export default Links
