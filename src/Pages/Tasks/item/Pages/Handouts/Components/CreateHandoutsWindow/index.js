import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Button, {
  LoadableBaseButton,
  SecondaryBlueButton,
} from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
  TASK_ITEM_HANDOUTS,
} from '@/contants'
import { useParams } from 'react-router-dom'
import { WithValidationForm } from '@Components/Components/Forms'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import DatePickerComponent from '@Components/Components/Inputs/DatePicker'
import UserSelect from '@/Components/Inputs/UserSelect'
import BaseUserSelect from '@/Components/Inputs/OrgStructure/BaseUserSelect'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { URL_ENTITY_LIST, URL_HANDOUTS_CREATE } from '@/ApiList'
import dayjs from 'dayjs'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import useTabItem from '@Components/Logic/Tab/TabItem'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Операция добавленa успешно',
    }
  },
}

const CreateHandoutsWindow = () => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [open, setOpenState] = useState(false)
  const [filterValue, setFilterValue] = useState({})
  const getNotification = useOpenNotification()

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_HANDOUTS,
  })

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const fields = useMemo(
    () => [
      {
        id: 'operationId',
        component: LoadableSelect,
        placeholder: 'Выберите операцию',
        label: 'Операция',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            query,
            type: 'ddt_dict_operations',
          })
          return data
        },
      },
      {
        id: 'operationDate',
        label: 'Дата операции',
        component: DatePickerComponent,
        placeholder: 'Выберите дату',
      },
      {
        id: 'archivistId',
        label: 'Архивариус',
        component: BaseUserSelect,
        placeholder: 'Выберите архивариуса',
      },
      {
        id: 'worker',
        label: 'Сотрудник',
        component: UserSelect,
        multiple: false,
        returnObjects: true,
        placeholder: 'Выберите участников',
      },
      {
        id: 'departmentName',
        label: 'Поддразделение',
        component: Select,
        placeholder: 'Выберите департамент',
        valueKey: 'department',
        labelKey: 'department',
        options: [
          {
            department: filterValue?.departmentName,
          },
        ],
      },
      {
        id: 'comment',
        label: 'Комментарий',
        component: SearchInput,
        placeholder: 'Введите комментарий',
      },
    ],
    [api, filterValue],
  )
  useEffect(() => {
    const { worker } = filterValue
    worker
      ? setFilterValue({ ...filterValue, departmentName: worker?.department })
      : setFilterValue(({ departmentName, ...item }) => item)
  }, [filterValue.worker])

  const createDate = useMemo(() => {
    const { worker, operationDate, ...other } = filterValue
    return {
      ...other,
      workerId: worker?.emplId,
      documentId: id,
      operationDate:
        operationDate &&
        dayjs(operationDate, PRESENT_DATE_FORMAT).format(
          DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
        ),
    }
  }, [filterValue, id])

  const onSave = useCallback(async () => {
    try {
      const response = await api.post(URL_HANDOUTS_CREATE, createDate)
      setTabState(setUnFetchedState())
      changeModalState(false)()
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, createDate, setTabState, changeModalState, getNotification])

  const onClose = useCallback(() => {
    setFilterValue({})
    changeModalState(false)()
  }, [changeModalState])

  return (
    <div className="flex items-center ml-auto ">
      <SecondaryBlueButton className="mr-2" onClick={changeModalState(true)}>
        Добавить операцию
      </SecondaryBlueButton>
      <StandardSizeModalWindow
        title="Добавить операцию"
        open={open}
        onClose={changeModalState(false)}
      >
        <div className="flex flex-col overflow-hidden h-full">
          <WithValidationForm
            className="form-element-sizes-40"
            fields={fields}
            value={filterValue}
            onInput={setFilterValue}
            inputWrapper={InputWrapper}
          />
        </div>
        <div className="flex items-center justify-end mt-8">
          <Button
            className="bg-light-gray flex items-center w-60 rounded-lg mr-4 font-weight-normal justify-center"
            onClick={onClose}
          >
            Закрыть
          </Button>
          <LoadableBaseButton
            className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center font-weight-normal"
            onClick={onSave}
          >
            Сохранить
          </LoadableBaseButton>
        </div>
      </StandardSizeModalWindow>
    </div>
  )
}

export default CreateHandoutsWindow
