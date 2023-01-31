import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Icon from '@Components/Components/Icon'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import Form from '@Components/Components/Forms'
import Button, { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import editIcon from '@/Icons/editIcon'
import InputComponent from '@Components/Components/Inputs/Input'
import { ApiContext } from '@/contants'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { LoadContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import {
  defaultMessageMap,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import {
  URL_APPROVAL_SHEET_CREATE,
  URL_APPROVAL_SHEET_UPDATE,
  URL_ENTITY_LIST,
} from '@/ApiList'
import LoadableSelect from '@/Components/Inputs/Select'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import UserSelect from '@/Components/Inputs/UserSelect'
import NumericInput from '@Components/Components/Inputs/NumericInput'
import {
  CustomSizeModalWindow,
  FilterForm,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow/styles'
import {
  VALIDATION_RULE_INTEGER,
  VALIDATION_RULE_REQUIRED,
} from '@Components/Logic/Validator/constants'

const customMessagesMap = {
  ...defaultMessageMap,
  200: {
    type: NOTIFICATION_TYPE_SUCCESS,
    message: 'Этап отредактирован',
  },
}

const rules = {
  name: [{ name: VALIDATION_RULE_REQUIRED }],
  term: [{ name: VALIDATION_RULE_INTEGER }, { name: VALIDATION_RULE_REQUIRED }],
}

const NAME = 'Указать наименование этапа вручную'

export const AddUserOptionsFullName = (v = {}) => ({
  ...v,
  fullName: `${v.dssApproverFio}`,
  fullDescription: v.fullDescription
    ? v.fullDescription
    : `${v.dssApproverFio}, ${v.dssApproverDep}`,
})

const EditStageWindow = (props) => {
  console.log(props, 'props')
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const loadData = useContext(LoadContext)
  const [open, setOpenState] = useState(false)
  const [typicalStage, setTypicalStage] = useState()
  const [filterValue, setFilterValue] = useState({})
  const getNotification = useOpenNotification()
  const ref = useRef(filterValue?.name)

  const initialFilterState = useMemo(() => {
    if (props) {
      const { term, approvers, name, globalId } = props

      return {
        term,
        name,
        approvers: approvers.map(({ dsidApproverEmpl }) => dsidApproverEmpl),
        id: globalId,
      }
    }
  }, [props])

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_ENTITY_LIST, {
        type: 'ddt_dict_typical_stage',
      })
      setTypicalStage(data)
    })()
  }, [api])

  useEffect(() => {
    setFilterValue((value) => {
      if (Object.keys(value) < 1) {
        return initialFilterState
      }
      return value
    })
  }, [initialFilterState])

  useEffect(() => {
    if (ref.current !== filterValue?.name) {
      setFilterValue((value) => {
        const res = (typicalStage || []).find(
          ({ dss_name }) => dss_name === value.name,
        )

        return { ...value, term: res?.dsi_work_day || initialFilterState.term }
      })
    }
    ref.current = filterValue.name
  }, [filterValue, initialFilterState.term, typicalStage])

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const options = useMemo(
    () => props?.approvers.map(AddUserOptionsFullName),
    [props?.approvers],
  )

  console.log(options, 'options')

  const visible = useMemo(() => filterValue?.name === NAME, [filterValue?.name])

  const fields = useMemo(
    () =>
      [
        {
          id: 'name',
          label: 'Наименование',
          component: LoadableSelect,
          placeholder: 'Наименование этапа',
          valueKey: 'dss_name',
          labelKey: 'dss_name',
          options: typicalStage,
          loadFunction: async (query) => {
            const { data } = await api.post(URL_ENTITY_LIST, {
              type: 'ddt_dict_typical_stage',
              query,
            })
            return data
          },
        },
        {
          id: 'show',
          component: SearchInput,
          visible: visible,
          multiple: true,
          returnOption: false,
          placeholder: 'Наименование этапа',
          label: 'Наименование этапа',
        },
        {
          id: 'approvers',
          component: UserSelect,
          options: options,
          valueKey: 'dsidApproverEmpl',
          multiple: true,
          returnOption: false,
          placeholder: 'Выберите участников',
          label: 'Участники',
        },
        {
          id: 'term',
          component: NumericInput,
          placeholder: 'Срок в рабочих днях',
          label: 'Укажите в рабочих днях',
        },
      ].filter(({ visible }) => visible !== false),
    [api, options, typicalStage, visible],
  )

  const stage = useMemo(() => {
    const { approvers = [], name, show, ...other } = filterValue
    return {
      ...other,
      name: visible ? show : name,
      documentId: id,
      autoApprove: false,
      approvers: approvers?.map((val) => {
        return { dsidApproverEmpl: val }
      }),
    }
  }, [filterValue, id, visible])

  const onSave = useCallback(async () => {
    try {
      const response = await api.post(URL_APPROVAL_SHEET_UPDATE, { stage })
      loadData()
      changeModalState(false)()
      getNotification(customMessagesMap[response.status])
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(customMessagesMap[status])
    }
  }, [api, stage, loadData, changeModalState, getNotification])

  const onClose = useCallback(() => {
    setFilterValue({})
    changeModalState(false)()
  }, [changeModalState])

  return (
    <div className="flex items-center ml-auto ">
      <Button className="color-blue-1" onClick={changeModalState(true)}>
        <Icon icon={editIcon} />
      </Button>
      <CustomSizeModalWindow
        title="Добавить этап"
        open={open}
        onClose={changeModalState(false)}
      >
        <div className="flex flex-col overflow-hidden h-full">
          <div className="flex py-4">
            <FilterForm
              className="form-element-sizes-40"
              fields={fields}
              value={filterValue}
              onInput={setFilterValue}
              inputWrapper={InputWrapper}
              rules={rules}
            />
          </div>
          <div className="mt-2">
            Контрольный срок согласования для томов ПД, РД:
            <br className="ml-6" />* Согласование служб - 3 раб. дн. <br />*
            Согласование куратора филиала - 1 раб. дн. <br />* Согласование
            куратора ИА - 1 раб. дн. <br />* Визирование - 10 раб. дн
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
      </CustomSizeModalWindow>
    </div>
  )
}

export default EditStageWindow
