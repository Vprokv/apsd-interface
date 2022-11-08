import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import Button, {
  LoadableBaseButton,
  SecondaryBlueButton,
} from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
} from '@/contants'
import { useParams } from 'react-router-dom'
import { FilterForm, TitlesContainer } from './styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import DatePickerComponent from '@Components/Components/Inputs/DatePicker'
import UserSelect from '@/Components/Inputs/UserSelect'
import BaseUserSelect from '@/Components/Inputs/OrgStructure/BaseUserSelect'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { URL_ENTITY_LIST, URL_HANDOUTS_CREATE } from '@/ApiList'
import dayjs from 'dayjs'
import EmptyInput from '@/Pages/Tasks/item/Pages/Links/Components/Input/style'

const CreateHandoutsWindow = ({ setChange }) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [open, setOpenState] = useState(false)
  const [filterValue, setFilterValue] = useState({})

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const fields = useMemo(
    () => [
      {
        id: '1',
        component: EmptyInput,
        value: 'Операция',
        disabled: true,
      },
      {
        id: 'operationId',
        component: LoadableSelect,
        placeholder: 'Выберите операцию',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_operations',
          })
          return data
        },
      },
      {
        id: '2',
        component: EmptyInput,
        value: 'Дата операции',
        disabled: true,
      },
      {
        id: 'operationDate',
        component: DatePickerComponent,
        placeholder: 'Выберите дату',
      },
      {
        id: '3',
        component: EmptyInput,
        value: 'Архивариус',
        disabled: true,
      },
      {
        id: 'archivistId',
        component: BaseUserSelect,
        placeholder: 'Выберите архивариуса',
      },
      {
        id: '4',
        component: EmptyInput,
        value: 'Сотрудник',
        disabled: true,
      },
      {
        id: 'worker',
        component: UserSelect,
        multiple: false,
        returnOption: true,
        placeholder: 'Выберите участников',
      },
      {
        id: '4',
        component: EmptyInput,
        value: 'Поддразделение',
        disabled: true,
      },
      {
        id: 'departmentName',
        component: Select,
        placeholder: 'Выберите департамент',
        valueKey: 'department',
        labelKey: 'department',
        options: filterValue?.workerId && [filterValue?.workerId],
      },
      {
        id: '5',
        component: EmptyInput,
        value: 'Комментарий',
        disabled: true,
      },
      {
        id: 'comment',
        component: SearchInput,
        placeholder: 'Введите комментарий',
      },
    ],
    [api, filterValue],
  )
  useEffect(() => {
    const { worker } = filterValue
    worker
      ? setFilterValue({ ...filterValue, departmentName: worker.department })
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
    await api.post(URL_HANDOUTS_CREATE, createDate)
    setChange()
    changeModalState(false)()
  }, [changeModalState, createDate, api, setChange])

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
          <FilterForm
            className="form-element-sizes-40"
            fields={fields}
            value={filterValue}
            onInput={setFilterValue}
            inputWrapper={EmptyInputWrapper}
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

CreateHandoutsWindow.propTypes = {
  setChange: PropTypes.func.isRequired,
}

export default CreateHandoutsWindow
