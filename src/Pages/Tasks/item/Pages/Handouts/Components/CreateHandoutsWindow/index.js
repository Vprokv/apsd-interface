import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Button, {
  LoadableBaseButton,
  SecondaryBlueButton,
} from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { ApiContext } from '@/contants'
import { useParams } from 'react-router-dom'
import { FilterForm, TitlesContainer } from './styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import LoadableSelect from '@/Components/Inputs/Select'
import DatePickerComponent from '@Components/Components/Inputs/DatePicker'
import UserSelect from '@/Components/Inputs/UserSelect'
import BaseUserSelect from '@/Components/Inputs/OrgStructure/BaseUserSelect'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { URL_ENTITY_LIST, URL_HANDOUTS_CREATE } from '@/ApiList'
import { TASK_TYPE } from '@/Pages/Tasks/list/constants'

const CreateHandoutsWindow = (props) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [open, setOpenState] = useState(false)
  const [filterValue, setFilterValue] = useState({})
  const [value, sendValue] = useState({})

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const titles = useMemo(
    () =>
      [
        'Операция',
        'Дата операции',
        'Архивариус',
        'Сотрудник',
        'Подразделение',
        'Комментарий',
      ].map((val) => (
        <div key={val} className="h-10 mb-4 font-size-14  flex items-center">
          {val}
        </div>
      )),
    [],
  )

  const onSave = useCallback(async () => {
    // await api.post(URL_HANDOUTS_CREATE, filterValue)
    changeModalState(false)
  }, [changeModalState, filterValue, api])

  const fields = useMemo(
    () => [
      {
        id: 'operationId',
        component: LoadableSelect,
        placeholder: 'Выберите операцию',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_operations',
          })
          return data
        },
      },
      {
        id: 'operationDate',
        component: DatePickerComponent,
        placeholder: 'Выберите дату',
      },
      {
        id: 'archivistId',
        component: BaseUserSelect,
        placeholder: 'Выберите архивариуса',
      },
      {
        id: 'workerId',
        component: (props) => <UserSelect {...props} sendValue={sendValue} />,
        multiple: false,
        returnObjects: true,
        placeholder: 'Выберите участников',
      },
      {
        id: 'departmentId',
        component: LoadableSelect,
        placeholder: 'Выберите департамент',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        // loadFunction: async () => {
        //   const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
        //   return data
        // },
      },
      {
        id: 'comment',
        component: SearchInput,
        placeholder: 'Введите комментарий',
      },
    ],
    [api, sendValue],
  )

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
          <div className="flex py-4">
            <TitlesContainer>{titles}</TitlesContainer>
            <FilterForm
              className="form-element-sizes-40"
              fields={fields}
              value={filterValue}
              onInput={setFilterValue}
              inputWrapper={EmptyInputWrapper}
            />
          </div>
        </div>
        <div className="flex items-center justify-end mt-8">
          <Button
            className="bg-light-gray flex items-center w-60 rounded-lg mr-4 font-weight-normal justify-center"
            onClick={changeModalState(false)}
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

CreateHandoutsWindow.propTypes = {}

export default CreateHandoutsWindow
