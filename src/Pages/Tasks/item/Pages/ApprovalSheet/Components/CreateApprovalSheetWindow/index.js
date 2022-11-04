import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import Button, { LoadableBaseButton } from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { ApiContext } from '@/contants'
import { useParams } from 'react-router-dom'
import { FilterForm, TitlesContainer } from './styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import UserSelect from '@/Components/Inputs/UserSelect'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { URL_APPROVAL_SHEET_CREATE } from '@/ApiList'
import plusIcon from '@/Icons/plusIcon'
import Icon from '@Components/Components/Icon'
import {
  LoadContext,
  TypeContext,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'

const fields = [
  {
    id: 'name',
    component: SearchInput,
    placeholder: 'Наименование этапа',
  },
  {
    id: 'approvers',
    component: UserSelect,
    multiple: true,
    returnOption: false,
    placeholder: 'Выберите участников',
  },
  {
    id: 'term',
    component: SearchInput,
    placeholder: 'Срок в рабочих днях',
  },
]

const CreateApprovalSheetWindow = ({ loadData }) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  // const loadData = useContext(LoadContext)
  const stageType = useContext(TypeContext)
  const [open, setOpenState] = useState(false)
  const [filterValue, setFilterValue] = useState({})

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const titles = useMemo(
    () =>
      ['Наименование этапа *', 'Участник этапа', 'Срок в рабочих днях *'].map(
        (val) => (
          <div key={val} className="h-10 mb-4 font-size-14  flex items-center">
            {val}
          </div>
        ),
      ),
    [],
  )

  const stage = useMemo(() => {
    const { approvers, ...other } = filterValue
    return {
      ...other,
      documentId: id,
      stageType,
      autoApprove: false,
      approvers: approvers?.map((val) => {
        return { dsidApproverEmpl: val }
      }),
    }
  }, [filterValue, id, stageType])

  const onSave = useCallback(async () => {
    await api.post(URL_APPROVAL_SHEET_CREATE, { stage })
    await loadData()
    changeModalState(false)()
  }, [changeModalState, stage, api, loadData])

  const onClose = useCallback(() => {
    setFilterValue({})
    changeModalState(false)()
  }, [changeModalState])

  return (
    <div className="flex items-center ml-auto ">
      <Button onClick={changeModalState(true)} className="color-blue-1">
        <Icon icon={plusIcon} />
      </Button>
      <StandardSizeModalWindow
        title="Добавить этап"
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

CreateApprovalSheetWindow.propTypes = {}

export default CreateApprovalSheetWindow
