import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Icon from '@Components/Components/Icon'
import { ButtonForIcon, SecondaryBlueButton } from '@/Components/Button'
import ListTable from '@Components/Components/Tables/ListTable'
import { useParams } from 'react-router-dom'
import {
  URL_CONTENT_LIST,
  URL_DELETE_VERSION,
  URL_UPDATE_VERSION,
} from '@/ApiList'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ApiContext, TASK_ITEM_CONTENT } from '@/contants'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import deleteIcon from '@/Icons/deleteIcon'
import editIcon from '@/Icons/editIcon'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Form from '@Components/Components/Forms'
import DownloadWindow from './Components/DownloadWindow'
import EmptyInputWrapper from '@Components/Components/Forms/EmptyInputWrapper'
import XlsIcon from '@/Icons/XlsIcon'
import WarningIcon from '@/Icons/warningIcon'
import Switch from '@/Components/Inputs/Switch'
import EditVersionWindow from './Components/EditVersionWindow'

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
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
    id: 'contentName',
    label: 'Описание',
    sizes: 190,
  },
  {
    id: 'versionDate',
    label: 'Дата загрузки',
  },
  {
    id: 'regNumber',
    label: 'Шифр/Рег. номер',
  },
  {
    id: 'contentType',
    label: 'Тип файла',
  },
  {
    id: 'author',
    label: 'Автор',
  },
  {
    id: 'version',
    label: 'Версия',
  },
  {
    id: 'comment',
    label: 'Комментарий',
  },
  // {
  //   id: 'Даты разраб.(план/факт)',
  //   label: 'Размер',
  //   // sizes: 200,
  // }
]

const filterFormConfig = [
  {
    id: 'fullVersion',
    widthButton: false,
    component: Switch,
    label: 'Отобразить все версии',
  },
]

const Content = () => {
  const { id } = useParams()
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [filterValue, setFilterValue] = useState(false)
  const [addSubscriptionWindow, setAddSubscriptionWindowState] = useState(false)
  const [openEditWindow, setOpenEditWindow] = useState(false)

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_CONTENT,
  })

  const {
    setTabState,
    tabState: { data },
  } = tabItemState

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_CONTENT_LIST, {
      documentId: id,
      isCurrentVersion: filterValue.fullVersion,
    })
    return data
  }, [filterValue.fullVersion, api, id])

  useAutoReload(loadData, tabItemState)

  const openSubscriptionWindow = useCallback(
    () => setAddSubscriptionWindowState(true),
    [],
  )
  const closeSubscriptionWindow = useCallback(
    () => setAddSubscriptionWindowState(false),
    [],
  )

  const deleteVersion = useCallback(async () => {
    const { id: versionId } = selectState
    if (selectState && selectState.length > 0) {
      await api.post(URL_DELETE_VERSION, {
        versionId,
      })
    }
  }, [selectState])

  const closeEditWindow = useCallback(() => setOpenEditWindow(false), [])

  const editVersion = useCallback(async () => {
    if (selectState && selectState.length > 0) {
      setOpenEditWindow(true)
    }
  }, [selectState])

  const onTableUpdate = useCallback(
    (data) => setTabState({ data }),
    [setTabState],
  )

  const idContent = useMemo(() => {
    if (data && data.length > 0) {
      return data.find((item) => item.version === 'Основная').id
    }
  }, [data])
  return (
    <div className="flex-container p-4 w-full overflow-hidden">
      <div className="flex items-center form-element-sizes-32">
        <Form
          fields={filterFormConfig}
          inputWrapper={EmptyInputWrapper}
          value={filterValue}
          onInput={setFilterValue}
        />
        <div className="ml-auto flex items-center color-text-secondary">
          <SecondaryBlueButton
            className="ml-2 text-white flex items-center w-60 rounded-lg justify-center"
            onClick={openSubscriptionWindow}
          >
            Добавить файл /версию
          </SecondaryBlueButton>
          <ButtonForIcon className="ml-2">
            <Icon icon={WarningIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="ml-2">
            <Icon icon={XlsIcon} />
          </ButtonForIcon>

          <ButtonForIcon className="ml-4" onClick={editVersion}>
            <Icon icon={editIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="ml-2" onClick={deleteVersion}>
            <Icon icon={deleteIcon} />
          </ButtonForIcon>
        </div>
      </div>
      <ListTable
        value={data}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        onInput={onTableUpdate}
        selectState={selectState}
        onSelect={setSelectState}
      />
      <DownloadWindow
        contentId={idContent}
        open={addSubscriptionWindow}
        onClose={closeSubscriptionWindow}
      />
      <EditVersionWindow
        formData={selectState}
        open={openEditWindow}
        onClose={closeEditWindow}
      />
    </div>
  )
}

export default Content
