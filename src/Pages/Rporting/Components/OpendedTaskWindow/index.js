import React, { useCallback, useContext, useMemo, useState } from 'react'
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
import { ApiContext, REPORTING_STATE } from '@/contants'
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

const OpenedTaskWindow = () => {
  const api = useContext(ApiContext)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState({ allUsers: false })
  const tabItemState = useTabItem({ stateId: REPORTING_STATE })
  const getNotification = useOpenNotification()
  const { tabState: { data, loading } = {}, setTabState } = tabItemState

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_REPORTS_STATISTIC, filter)
      return data
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter, getNotification])

  useAutoReload(loadData, tabItemState)

  const onReload = useCallback(() => {
    setTabState({ loading: false, fetched: false })
  }, [setTabState])

  const onOpen = useCallback(() => {
    setTabState({ loading: false, fetched: false })
    setOpen(true)
  }, [setTabState])

  return (
    <div>
      <SecondaryBlueButton onClick={onOpen}>
        Тек. задачи
      </SecondaryBlueButton>
      <StandardSizeModalWindow
        title="Текущие задачи"
        open={open}
        onClose={() => setOpen(false)}
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
              onInput={setFilter}
            />
            <div className="ml-auto flex items-center color-text-secondary ">
              <Tips text="Обновить">
                <LoadableButtonForIcon onClick={onReload} className="ml-2">
                  <Icon icon={ReloadIcon} />
                </LoadableButtonForIcon>
              </Tips>
            </div>
          </div>
          <ListTable
            className="mt-2"
            value={data}
            columns={columns}
            headerCellComponent={HeaderCell}
            loading={loading}
          />
        </div>
        <div className="flex items-center justify-end">
          <SecondaryOverBlueButton onClick={() => setOpen(false)}>
            Закрыть
          </SecondaryOverBlueButton>
        </div>
      </StandardSizeModalWindow>
    </div>
  )
}

OpenedTaskWindow.propTypes = {}

export default OpenedTaskWindow
