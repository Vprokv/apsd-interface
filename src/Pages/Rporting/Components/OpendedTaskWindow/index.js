import { useCallback, useContext, useMemo, useState } from 'react'
import {
  LoadableButtonForIcon,
  SecondaryBlueButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import CheckBox from '@/Components/Inputs/CheckBox'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {ApiContext, NOTIFICATION, REPORTING_STATE} from '@/contants'
import BaseCell, {
  sizes as baseCellSize,
} from '@/Components/ListTableComponents/BaseCell'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { URL_REPORTS_STATISTIC } from '@/ApiList'
import Tips from '@/Components/Tips'
import Icon from '@Components/Components/Icon'
import ReloadIcon from '@/Icons/ReloadIcon'
import Form from '@Components/Components/Forms'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import Header from "@Components/Components/Tables/ListTable/header";
import {useBackendColumnSettingsState} from "@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState";
import ColumnController from "@/Components/ListTableComponents/ColumnController";

const columns = [
  {
    id: 'initiator',
    label: 'Этап',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'taskName',
    label: 'Задача',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'state',
    label: 'Состояние',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'startAt',
    label: 'Начата',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'endAt',
    label: 'Завершена',
    component: BaseCell,
    sizes: baseCellSize,
  },
]

const baseFilter = { allUsers: false }

const plugin = {
  movePlugin: {
    id: REPORTING_STATE,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const OpenedTaskWindow = () => {
  const api = useContext(ApiContext)
  const [open, setOpen] = useState(false)
  const [{ filter = baseFilter, ...tabState }, setTabState] = useTabItem({
    stateId: REPORTING_STATE,
  })

  const getNotification = useOpenNotification()

  const [{ data, loading, reloadData }] = useAutoReload(
    useCallback(async () => {
      try {
        const { data } = await api.post(URL_REPORTS_STATISTIC, filter)
        return data
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    }, [api, filter, getNotification]),
    tabState,
    setTabState,
  )

  const onReload = useCallback(() => {
    reloadData()
  }, [reloadData])

  const onOpen = useCallback(
    (v) => () => {
      setOpen(v)
    },
    [],
  )

  return (
    <div>
      <SecondaryBlueButton onClick={onOpen(true)}>
        Тек. задачи
      </SecondaryBlueButton>
      <StandardSizeModalWindow
        title="Текущие задачи"
        open={open}
        onClose={onOpen(false)}
      >
        <div className="flex-container pr-4 w-full overflow-hidden">
          <div className="flex items-center form-element-sizes-32 mb-4">
            <Form
              className="pl-4"
              fields={useMemo(
                () => [
                  {
                    id: 'allUsers',
                    component: CheckBox,
                    text: 'Задачи всех пользователей',
                  },
                ],
                [],
              )}
              inputWrapper={emptyWrapper}
              value={filter}
              onInput={useCallback(
                (filter) => setTabState({ filter }),
                [setTabState],
              )}
            />
            <div className="ml-auto flex items-center color-text-secondary ">
              <Tips text="Обновить">
                <LoadableButtonForIcon onClick={onReload} className="ml-2">
                  <Icon icon={ReloadIcon} />
                </LoadableButtonForIcon>
              </Tips>
              <ColumnController columns={columns} id={REPORTING_STATE} />
            </div>
          </div>
          <ListTable
            className="mt-2"
            value={data}
            columns={columns}
            headerCellComponent={HeaderCell}
            loading={loading}
            plugin={plugin}
          />
        </div>
        <div className="flex items-center justify-end">
          <SecondaryOverBlueButton onClick={onOpen(false)}>
            Закрыть
          </SecondaryOverBlueButton>
        </div>
      </StandardSizeModalWindow>
    </div>
  )
}

OpenedTaskWindow.propTypes = {}

export default OpenedTaskWindow
